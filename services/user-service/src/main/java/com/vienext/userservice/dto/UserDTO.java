package com.vienext.userservice.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserDTO {

    private String id;

    private String username;

    private String email;

    private String phoneNumber;

    private String role;

    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    private String profilePicture;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime lastLogin;

    private String status;

    private String subscriptionPlan;
}