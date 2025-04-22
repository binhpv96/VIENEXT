package com.vienext.userservice.service;

import com.vienext.userservice.config.JwtUtil;
import com.vienext.userservice.dto.LoginDTO;
import com.vienext.userservice.dto.RegisterDTO;
import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import jakarta.annotation.PostConstruct;
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

//    @PostConstruct
//    public void testMongoDBConnection() {
//        User testUser = User.builder()
//                .username("testMongo")
//                .email("testmongo@example.com")
//                .password("test")
//                .role("ROLE_USER")
//                .isVip(false)
//                .build();
//        userRepository.save(testUser);
//        System.out.println("Test user saved: " + userRepository.findByUsername("testMongo"));
//    }

    public User registerUser(RegisterDTO registerDTO) {
        String username = registerDTO.getUsername();
        String password = registerDTO.getPassword();
        String email = registerDTO.getEmail();

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("ROLE_USER")
                .isVip(false)
                .build();
        return userRepository.save(user);
    }

    public String loginUser(LoginDTO loginDTO) {
        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();
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