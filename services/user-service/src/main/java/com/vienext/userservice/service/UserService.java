package com.vienext.userservice.service;

import com.vienext.userservice.config.JwtUtil;
import com.vienext.userservice.dto.LoginDTO;
import com.vienext.userservice.dto.RegisterDTO;
import com.vienext.userservice.dto.UpgradePlanDTO;
import com.vienext.userservice.dto.UserDTO;
import com.vienext.userservice.model.SubscriptionPlan;
import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User register(RegisterDTO registerDTO) {
        String phoneNumber = registerDTO.getPhoneNumber();
        String password = registerDTO.getPassword();
        String email = registerDTO.getEmail();

        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            throw new RuntimeException("Phone number already exists");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = User.builder()
                .phoneNumber(phoneNumber)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("ROLE_USER")
                .subscriptionPlan(SubscriptionPlan.FREE.getPlanName())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .status("ACTIVE")
                .build();
        return userRepository.save(user);
    }

    public String login(LoginDTO loginDTO) {
        String identifier = loginDTO.getIdentifier();
        String password = loginDTO.getPassword();
        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByPhoneNumber(identifier)
                .orElseThrow(() -> new RuntimeException("User not found")));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Tạo token JWT (dùng email làm subject thay vì username)
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        storeTokenInRedis(user.getEmail(), token);
        return token;
    }

    public UserDTO getUserById(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOptional.get();

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setDateOfBirth(user.getDateOfBirth());
        userDTO.setGender(user.getGender());
        userDTO.setAddress(user.getAddress());
        userDTO.setProfilePicture(user.getProfilePicture());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUpdatedAt(user.getUpdatedAt());
        userDTO.setLastLogin(user.getLastLogin());
        userDTO.setStatus(user.getStatus());
        userDTO.setSubscriptionPlan(user.getSubscriptionPlan());

        return userDTO;
    }

    public UserDTO updateUser(String userId, @Valid UserDTO updateUserDTO) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOptional.get();

        if (updateUserDTO.getFirstName() != null) {
            user.setFirstName(updateUserDTO.getFirstName());
        }
        if (updateUserDTO.getLastName() != null) {
            user.setLastName(updateUserDTO.getLastName());
        }
        if (updateUserDTO.getDateOfBirth() != null) {
            user.setDateOfBirth(updateUserDTO.getDateOfBirth());
        }
        if (updateUserDTO.getGender() != null) {
            user.setGender(updateUserDTO.getGender());
        }
        if (updateUserDTO.getAddress() != null) {
            user.setAddress(updateUserDTO.getAddress());
        }
        if (updateUserDTO.getProfilePicture() != null) {
            user.setProfilePicture(updateUserDTO.getProfilePicture());
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setId(updatedUser.getId());
        userDTO.setUsername(updatedUser.getUsername());
        userDTO.setEmail(updatedUser.getEmail());
        userDTO.setPhoneNumber(updatedUser.getPhoneNumber());
        userDTO.setRole(updatedUser.getRole());
        userDTO.setFirstName(updatedUser.getFirstName());
        userDTO.setLastName(updatedUser.getLastName());
        userDTO.setDateOfBirth(updatedUser.getDateOfBirth());
        userDTO.setGender(updatedUser.getGender());
        userDTO.setAddress(updatedUser.getAddress());
        userDTO.setProfilePicture(updatedUser.getProfilePicture());
        userDTO.setCreatedAt(updatedUser.getCreatedAt());
        userDTO.setUpdatedAt(updatedUser.getUpdatedAt());
        userDTO.setLastLogin(updatedUser.getLastLogin());
        userDTO.setStatus(updatedUser.getStatus());
        userDTO.setSubscriptionPlan(updatedUser.getSubscriptionPlan());

        return userDTO;
    }

    public UserDTO upgradeUserPlan(String userId, UpgradePlanDTO upgradePlanDTO) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOptional.get();
        String newPlan = upgradePlanDTO.getSubscriptionPlan();

        // Kiểm tra gói mới có hợp lệ không
        boolean isValidPlan = Arrays.stream(SubscriptionPlan.values())
                .anyMatch(plan -> plan.getPlanName().equals(newPlan));
        if (!isValidPlan) {
            throw new RuntimeException("Invalid subscription plan: " + newPlan);
        }

        // Kiểm tra xem gói mới có khác gói hiện tại không
        if (user.getSubscriptionPlan().equals(newPlan)) {
            throw new RuntimeException("User is already on the " + newPlan + " plan");
        }

        // Cập nhật gói và thời gian updatedAt
        user.setSubscriptionPlan(newPlan);
        user.setUpdatedAt(LocalDateTime.now());

        // Lưu user đã cập nhật
        User updatedUser = userRepository.save(user);

        // Ánh xạ sang UserDTO để trả về
        UserDTO userDTO = new UserDTO();
        userDTO.setId(updatedUser.getId());
        userDTO.setUsername(updatedUser.getUsername());
        userDTO.setEmail(updatedUser.getEmail());
        userDTO.setPhoneNumber(updatedUser.getPhoneNumber());
        userDTO.setRole(updatedUser.getRole());
        userDTO.setFirstName(updatedUser.getFirstName());
        userDTO.setLastName(updatedUser.getLastName());
        userDTO.setDateOfBirth(updatedUser.getDateOfBirth());
        userDTO.setGender(updatedUser.getGender());
        userDTO.setAddress(updatedUser.getAddress());
        userDTO.setProfilePicture(updatedUser.getProfilePicture());
        userDTO.setCreatedAt(updatedUser.getCreatedAt());
        userDTO.setUpdatedAt(updatedUser.getUpdatedAt());
        userDTO.setLastLogin(updatedUser.getLastLogin());
        userDTO.setStatus(updatedUser.getStatus());
        userDTO.setSubscriptionPlan(updatedUser.getSubscriptionPlan());

        return userDTO;
    }

    public void storeTokenInRedis(String email, String token) {
        System.out.println("Storing token for user: " + email + ", token: " + token);
    }
}