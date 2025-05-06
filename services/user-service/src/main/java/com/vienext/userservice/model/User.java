package com.vienext.userservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;

    private String username;

    private String email;

    private String phoneNumber;

    private String password;

    private String role;

    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private String gender; // MALE, FEMALE, OTHER

    private String address; // sau này chia ra rõ ràng để thuận tiện cho các user tìm người dùng

    private String profilePicture;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime lastLogin;

    private String status;

    private String subscriptionPlan; // FREE, PREMIUM, ENTERPRISE
}