package com.example.backend.DTOs;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponseDTO {
    private Long id;
    private String text;
    private Long userId;
    private String username;
    private Long pinId;
    private Instant createdAt;

    public CommentResponseDTO(Long id, String text, Long userId, String username, Long pinId, Instant createdAt) {
        this.id = id;
        this.text = text;
        this.userId = userId;
        this.username = username;
        this.pinId = pinId;
        this.createdAt = createdAt;
    }
}
