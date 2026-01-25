package com.example.backend.DTOs;

import java.util.List;

import com.example.backend.models.User;

import lombok.Getter;

// DTO for sending user data back to the client. This excludes sensitive information like password
// getter only because this is only for sending data out
@Getter
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private List<PinResponseDTO> pins;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.pins = user.getPins().stream()
                .map(PinResponseDTO::new)
                .toList();
    }
}
