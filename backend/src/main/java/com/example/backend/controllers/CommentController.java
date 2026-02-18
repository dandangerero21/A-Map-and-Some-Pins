package com.example.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.DTOs.CommentCreateDTO;
import com.example.backend.DTOs.CommentResponseDTO;
import com.example.backend.services.CommentService;

@RequestMapping("/comments")
@RestController
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    
    @PostMapping("/add")
    public CommentResponseDTO addComment(@RequestBody CommentCreateDTO dto) {
        return commentService.addComment(dto.getText(), dto.getUserId(), dto.getPinId());
    }

    @GetMapping("/pins/{pinId}")
    public List<CommentResponseDTO> getCommentsForPin(@PathVariable Long pinId) {
        return commentService.findCommentsByPinId(pinId);
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
    }
}
