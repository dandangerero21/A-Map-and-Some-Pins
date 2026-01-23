package com.example.backend.DTOs;

import java.time.LocalDateTime;
import com.example.backend.models.Pin;
import lombok.Getter;
import lombok.Setter;

// DTO for sending pin data back to the client. This excludes sensitive information
// getter and setter because this is for sending data out
@Getter
@Setter
public class PinResponseDTO {
    private Long id;
    private String title;
    private String description;
    private double latitude;
    private double longitude;
    private String imageUrl;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;

    public PinResponseDTO(Pin pin) {
        this.id = pin.getId();
        this.title = pin.getTitle();
        this.description = pin.getDescription();
        this.latitude = pin.getLatitude();
        this.longitude = pin.getLongitude();
        this.imageUrl = pin.getImageUrl();
        this.userId = pin.getUser().getId();
        this.username = pin.getUser().getUsername();
        this.createdAt = pin.getCreatedAt();
    }
}
