package com.vienext.userservice.config;

import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import com.vienext.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String email;
        String username;
        String role = "ROLE_USER";

        if (authentication.getPrincipal() instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            email = oidcUser.getEmail();
            username = oidcUser.getPreferredUsername();
        } else if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            email = (String) oauth2User.getAttributes().get("email");
            username = (String) oauth2User.getAttributes().get("login");
        } else {
            throw new IllegalStateException("Unexpected user type: " + authentication.getPrincipal().getClass());
        }

        // Đảm bảo email và username là final trước khi dùng trong lambda
        final String finalEmail = email != null ? email : username + "@github.com";
        final String finalUsername = username;

        User user = userRepository.findByEmail(finalEmail)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .username(finalUsername)
                            .email(finalEmail)
                            .role(role)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .status("ACTIVE")
                            .subscriptionPlan("FREE")
                            .build();
                    return userRepository.save(newUser);
                });

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        userService.storeTokenInRedis(user.getUsername(), token);

        response.sendRedirect("http://localhost:3000/callback?token=" + token);
    }
}