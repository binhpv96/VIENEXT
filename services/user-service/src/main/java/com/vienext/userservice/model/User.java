package com.vienext.userservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private String password;
    private String role;
    private boolean isVip;
}