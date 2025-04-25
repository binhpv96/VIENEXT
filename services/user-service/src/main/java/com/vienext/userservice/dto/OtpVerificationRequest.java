package com.vienext.userservice.dto;

import lombok.Data;

@Data
public class OtpVerificationRequest {
    private String email;
    private String otp;
}
