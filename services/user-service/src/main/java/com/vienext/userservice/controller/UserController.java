package com.vienext.userservice.controller;

import com.vienext.userservice.model.User;
import com.vienext.userservice.model.UserDTO;
import com.vienext.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody UserDTO userDTO) {
        User user = userService.register(userDTO);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody UserDTO userDTO) {
        String token = userService.login(userDTO.getUsername(), userDTO.getPassword());
        return ResponseEntity.ok(token);
    }

    @PutMapping("/{userId}/upgrade-vip")
    public ResponseEntity<User> upgradeToVip(@PathVariable String userId) {
        User user = userService.upgradeToVip(userId);
        return ResponseEntity.ok(user);
    }
}