package com.vienext.userservice.service;

import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Tạo người dùng mới
    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now().toString());
        return userRepository.save(user);
    }

    // Lấy tất cả người dùng
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Lấy người dùng theo ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // Lấy người dùng theo username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Cập nhật người dùng
    public User updateUser(String id, User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setPassword(userDetails.getPassword());
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found");
    }

    // Xóa người dùng
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
