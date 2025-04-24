package com.vienext.userservice.controller;

import com.vienext.userservice.dto.LoginDTO;
import com.vienext.userservice.dto.RegisterDTO;
import com.vienext.userservice.dto.UpgradePlanDTO;
import com.vienext.userservice.dto.UserDTO;
import com.vienext.userservice.model.User;
import com.vienext.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@Valid @RequestBody RegisterDTO registerDTO) {
        return userService.register(registerDTO);
    }

    @PostMapping("/login")
    public String login(@Valid @RequestBody LoginDTO loginDTO) {
        return userService.login(loginDTO);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String userId) {
        // lấy thông tin user từ token JWT
        String authenticatedEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDTO userDTO = userService.getUserById(userId);

        if (!authenticatedEmail.equals(userDTO.getEmail())) {
            throw new RuntimeException("You are not authorized to access this user's information");
        }

        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable String userId, @Valid @RequestBody UserDTO updateUserDTO) {
        String authenticatedEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDTO userDTO = userService.getUserById(userId);

        if (!authenticatedEmail.equals(userDTO.getEmail())) {
            throw new RuntimeException("You are not authorized to update this user's information");
        }
        UserDTO updatedUserDTO = userService.updateUser(userId, updateUserDTO);
        return ResponseEntity.ok(updatedUserDTO);
    }

    @PutMapping("/{userId}/subscription")
    public ResponseEntity<UserDTO> upgradeUserPlan(@PathVariable String userId, @RequestBody UpgradePlanDTO upgradePlanDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedEmail = authentication.getName();
        UserDTO userDTO = userService.getUserById(userId);

        // Kiểm tra quyền truy cập
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        boolean isSelf = userDTO.getEmail().equals(authenticatedEmail);

        if (!isSelf && !isAdmin) {
            throw new RuntimeException("You are not authorized to upgrade this user's subscription plan");
        }

        UserDTO updatedUserDTO = userService.upgradeUserPlan(userId, upgradePlanDTO);
        return ResponseEntity.ok(updatedUserDTO);
    }
}