package com.example.backend.DTOs;

import lombok.Getter;
import lombok.Setter;

// DTO for creating a new Pin. This is what the client sends to the server when creating a pin
@Getter
@Setter
public class PinCreateDTO {
    private String title;
    private String description;
    private double latitude;
    private double longitude;
    private String imageUrl;
    private Long userId;
}
