package com.vienext.userservice.controller;

import com.vienext.userservice.config.JwtUtil;
import com.vienext.userservice.dto.UserDTO;
import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import com.vienext.userservice.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserDTO userDTO) {
        User user = userService.register(userDTO);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
        String token = userService.login(userDTO.getUsername(), userDTO.getPassword());
        return ResponseEntity.ok(token);
    }

    @GetMapping("/auth/google")
    public void googleLogin() {
        // Spring Security sẽ tự động xử lý redirect đến Google login
    }

    @GetMapping("/auth/success")
    public void authSuccess(@AuthenticationPrincipal OidcUser oidcUser, HttpServletResponse response) throws IOException {
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

        // Redirect về frontend với token trong query parameter
        response.sendRedirect("http://localhost:3000/callback?token=" + token);
    }
}