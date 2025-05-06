package com.vienext.userservice.config;

import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import com.vienext.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final String redirectUrl;

    @Autowired
    public OAuth2SuccessHandler(UserService userService, JwtUtil jwtUtil, UserRepository userRepository,
                                @Value("${app.redirect-url:http://localhost:3000/callback}") String redirectUrl) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.redirectUrl = redirectUrl;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // Trích xuất thông tin người dùng
        String email = null;
        String username = null;
        String userIdFromProvider = null;

        if (authentication.getPrincipal() instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            email = oidcUser.getEmail();
            username = oidcUser.getPreferredUsername();
            userIdFromProvider = oidcUser.getSubject(); // ID duy nhất từ OIDC
        } else if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            email = (String) oauth2User.getAttributes().get("email");
            username = (String) oauth2User.getAttributes().get("login");
            // Xử lý id có thể là Integer
            Object id = oauth2User.getAttributes().get("id");
            userIdFromProvider = (id != null) ? id.toString() : null; // Chuyển đổi an toàn
        }

        // Gán giá trị mặc định nếu null, đảm bảo không tái gán sau này
        final String finalEmail = (email != null) ? email : (username != null ? username + "@temp-provider.com" : userIdFromProvider + "@temp-provider.com");
        final String finalUsername = (username != null) ? username : "user_" + userIdFromProvider;
        final String finalUserIdFromProvider = (userIdFromProvider != null) ? userIdFromProvider : null;
        if (finalUserIdFromProvider == null) {
            throw new IllegalStateException("Cannot determine user ID from OAuth2 provider");
        }

        // Tìm hoặc tạo user
        User user = userRepository.findByEmail(finalEmail)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .username(finalUsername)
                            .email(finalEmail)
                            .role("ROLE_USER")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .status("ACTIVE")
                            .subscriptionPlan("FREE")
                            .build();
                    return userRepository.save(newUser);
                });

        // Cập nhật thông tin
        user.setLastLogin(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Tạo token JWT
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

        // Lưu token vào Redis
        try {
            userService.storeTokenInRedis(user.getUsername(), token);
        } catch (Exception e) {
            System.err.println("Failed to store token in Redis: " + e.getMessage());
            // Tiếp tục dù Redis lỗi, vì token vẫn hoạt động qua cookie
        }

        // Set token vào HttpOnly Cookie
        String cookieValue = String.format("token=%s; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=%d",
                token, 7 * 24 * 60 * 60); // 7 ngày
        response.addHeader("Set-Cookie", cookieValue);

        // Chuyển hướng
        response.sendRedirect(redirectUrl);
    }

    private IllegalStateException throwIllegalStateException() {
        throw new IllegalStateException("Cannot determine user ID from OAuth2 provider");
    }
}