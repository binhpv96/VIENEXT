package com.vienext.userservice.service;

import com.vienext.userservice.config.JwtUtil;
import com.vienext.userservice.dto.UserDTO;
import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class UserService {

    private static final String TOKEN_PREFIX = "jwt:";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public User register(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = User.builder()
                .username(userDTO.getUsername())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .email(userDTO.getEmail())
                .isVip(false)
                .role("ROLE_USER")
                .build();
        return userRepository.save(user);
    }

    public String login(String username, String password) {
        System.out.println("Attempting login for user: " + username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("User found: " + user.getUsername());
        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password matches: " + passwordMatches);
        if (!passwordMatches) {
            throw new RuntimeException("Invalid password");
        }
        String token = jwtUtil.generateToken(username, user.getRole());
        System.out.println("Token generated: " + token);
        storeTokenInRedis(username, token);
        return token;
    }

    public void storeTokenInRedis(String username, String token) {
        redisTemplate.opsForValue().set(TOKEN_PREFIX + username, token, 1, TimeUnit.HOURS);
        System.out.println("Token stored in Redis for user: " + username);
    }
}