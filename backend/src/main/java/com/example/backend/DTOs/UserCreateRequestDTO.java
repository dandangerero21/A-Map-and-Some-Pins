package com.example.backend.DTOs;

import lombok.Getter;
import lombok.Setter;

// DTO for handling user creation and update requests. This is what the client sends to the server (other values like ID are managed internally)
// getter and setter because this is for receiving data
@Getter
@Setter
public class UserCreateRequestDTO {
    private String username;
    private String email;
    private String password;
    private String usernameOrEmail; // For login requests
}
