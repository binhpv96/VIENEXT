package com.vienext.userservice.service;

import com.vienext.userservice.config.JwtUtil;
import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User registerUser(String username, String email, String password) {
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("ROLE_USER")
                .isVip(false)
                .build();
        return userRepository.save(user);
    }

    public String loginUser(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }

    public void storeTokenInRedis(String username, String token) {
        // Logic lưu token vào Redis (nếu có)
        System.out.println("Storing token for user: " + username + ", token: " + token);
    }
}