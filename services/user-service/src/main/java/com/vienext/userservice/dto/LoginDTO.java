package com.vienext.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {
    @NotBlank(message = "Phone number or Email is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;
}