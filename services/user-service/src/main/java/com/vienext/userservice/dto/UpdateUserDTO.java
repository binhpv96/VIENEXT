package com.vienext.userservice.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserDTO {

    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    private String profilePicture;
}