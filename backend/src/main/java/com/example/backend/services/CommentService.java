package com.example.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend.DTOs.CommentResponseDTO;
import com.example.backend.models.Comment;
import com.example.backend.repositories.CommentRepository;
import com.example.backend.repositories.PinRepository;
import com.example.backend.repositories.UserRepository;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PinRepository pinRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository, PinRepository pinRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.pinRepository = pinRepository;
    }

    public CommentResponseDTO addComment(String text, Long userId, Long pinId) {
        // Validate user and pin existence
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        if (!pinRepository.existsById(pinId)) {
            throw new RuntimeException("Pin not found with id: " + pinId);
        }

        // Create and save the comment
        Comment comment = new Comment();
        comment.setText(text);
        comment.setUser(userRepository.findById(userId).orElseThrow());
        comment.setPin(pinRepository.findById(pinId).orElseThrow());
        Comment savedComment = commentRepository.save(comment);
        return new CommentResponseDTO(
            savedComment.getId(),
            savedComment.getText(),
            savedComment.getUser().getId(),
            savedComment.getUser().getUsername(),
            savedComment.getPin().getId(),
            savedComment.getCreatedAt() != null ? savedComment.getCreatedAt().toString() : null
        );
    }

    public List<CommentResponseDTO> findCommentsByPinId(Long pinId) {
        if (!pinRepository.existsById(pinId)) {
            throw new RuntimeException("Pin not found with id: " + pinId);
        }
        return commentRepository.findByPinIdOrderByCreatedAtDesc(pinId)
            .stream()
            .map(comment -> new CommentResponseDTO(
                comment.getId(),
                comment.getText(),
                comment.getUser().getId(),
                comment.getUser().getUsername(),
                comment.getPin().getId(),
                comment.getCreatedAt() != null ? comment.getCreatedAt().toString() : null
            ))
            .collect(Collectors.toList());
    }

    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new RuntimeException("Comment not found with id: " + commentId);
        }
        commentRepository.deleteById(commentId);
    }
}
