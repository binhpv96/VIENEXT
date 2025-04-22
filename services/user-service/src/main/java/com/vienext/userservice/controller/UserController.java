package com.vienext.userservice.controller;

import com.vienext.userservice.config.JwtUtil;
import com.vienext.userservice.dto.LoginDTO;
import com.vienext.userservice.dto.RegisterDTO;
import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import com.vienext.userservice.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User register(@Valid @RequestBody RegisterDTO registerDTO) {
        return userService.registerUser(registerDTO);
    }

    @PostMapping("/login")
    public String login(@Valid @RequestBody LoginDTO loginDTO) {
        return userService.loginUser(loginDTO);
    }

    @GetMapping("/auth/google")
    public void googleLogin(HttpServletResponse response) throws IOException {
        System.out.println("Google login endpoint called");
        // Spring Security sẽ tự động xử lý redirect đến Google login
    }

    @GetMapping("/auth/success")
    public void authSuccess(@AuthenticationPrincipal OidcUser oidcUser, HttpServletResponse response) throws IOException {
        System.out.println("Auth success endpoint called");
        String email = oidcUser.getEmail();
        String username = oidcUser.getPreferredUsername();
        String role = "ROLE_USER";

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .username(username)
                            .email(email)
                            .role(role)
                            .isVip(false)
                            .build();
                    return userRepository.save(newUser);
                });

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        userService.storeTokenInRedis(user.getUsername(), token);

        response.sendRedirect("http://localhost:3000/callback?token=" + token);
    }
}