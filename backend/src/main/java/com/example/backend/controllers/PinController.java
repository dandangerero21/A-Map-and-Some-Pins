package com.example.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.DTOs.PinCreateDTO;
import com.example.backend.DTOs.PinResponseDTO;
import com.example.backend.DTOs.PinUpdateDTO;
import com.example.backend.services.PinService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/pins")
public class PinController {

    private final PinService pinService;
    public PinController(PinService pinService) {
        this.pinService = pinService;
    }

    @PostMapping("/create")
    public PinResponseDTO createPin(@RequestBody PinCreateDTO dto) {
        return pinService.createPin(dto);
    }

    @GetMapping
    public List<PinResponseDTO> getAllPins() {
        return pinService.getAllPins();
    }

    @GetMapping("/{id}")
    public PinResponseDTO getPinById(@PathVariable Long id) {
        return pinService.getPinById(id);
    }

    @GetMapping("/user/{userId}")
    public List<PinResponseDTO> getPinByUserId(@PathVariable Long userId) {
        return pinService.getPinByUserId(userId);
    }

    @PutMapping("/{id}")
    public PinResponseDTO updatePin(@PathVariable Long id, @RequestBody PinUpdateDTO dto) {
        return pinService.updatePin(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletePin(@PathVariable Long id) {
        pinService.deletePin(id);
    }
}
