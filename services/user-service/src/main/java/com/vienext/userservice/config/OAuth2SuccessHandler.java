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
    private final String baseRedirectUrl;

    @Autowired
    public OAuth2SuccessHandler(UserService userService, JwtUtil jwtUtil, UserRepository userRepository,
                                @Value("${app.redirect-base-url:http://localhost:3000}") String baseRedirectUrl) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.baseRedirectUrl = baseRedirectUrl;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String email = null;
        String username = null;
        String userIdFromProvider = null;

        if (authentication.getPrincipal() instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            email = oidcUser.getEmail();
            username = oidcUser.getPreferredUsername();
            userIdFromProvider = oidcUser.getSubject();
        } else if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            email = (String) oauth2User.getAttributes().get("email");
            username = (String) oauth2User.getAttributes().get("login");
            Object id = oauth2User.getAttributes().get("id");
            userIdFromProvider = (id != null) ? id.toString() : null;
        }

        final String finalEmail = (email != null) ? email : (username != null ? username + "@temp-provider.com" : userIdFromProvider + "@temp-provider.com");
        final String finalUsername = (username != null) ? username : "user_" + userIdFromProvider;
//        final String finalUserIdFromProvider = (userIdFromProvider != null) ? userIdFromProvider : throwIllegalStateException();

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

        user.setLastLogin(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

        try {
            userService.storeTokenInRedis(user.getEmail(), token);
        } catch (Exception e) {
            System.err.println("Failed to store token in Redis: " + e.getMessage());
        }

        String cookieValue = String.format("token=%s; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=%d",
                token, 7 * 24 * 60 * 60);
        response.addHeader("Set-Cookie", cookieValue);

        // Redirect trực tiếp đến trang feed với thông tin người dùng
        // NOTE: Nhớ không gửi thông tin người dùng :))) giờ tao gửi để test xem login thành công hay không thôi nhé
        String redirectUrl = baseRedirectUrl + "/dashboard?username=" + finalUsername;
        response.sendRedirect(redirectUrl);
    }

    private IllegalStateException throwIllegalStateException() {
        throw new IllegalStateException("Cannot determine user ID from OAuth2 provider");
    }
}