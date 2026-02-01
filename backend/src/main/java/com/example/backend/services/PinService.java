package com.example.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend.DTOs.PinCreateDTO;
import com.example.backend.DTOs.PinResponseDTO;
import com.example.backend.DTOs.PinUpdateDTO;
import com.example.backend.models.Pin;
import com.example.backend.models.User;
import com.example.backend.repositories.PinRepository;
import com.example.backend.repositories.UserRepository;

@Service
public class PinService {
    private final PinRepository pinRepository;

    private final UserRepository userRepository;

    public PinService(PinRepository pinRepository, UserRepository userRepository) {
        this.pinRepository = pinRepository;
        this.userRepository = userRepository;
    }

    public List<PinResponseDTO> getAllPins() {
        List<Pin> pins = pinRepository.findAll();
        return pins.stream()
                .map(PinResponseDTO::new)
                .collect(Collectors.toList());
    }

    public PinResponseDTO getPinById(Long id) {
        return pinRepository.findById(id)
                .map(PinResponseDTO::new)
                .orElseThrow(() -> new RuntimeException("Pin not found with id: " + id));
    }

    public List<PinResponseDTO> getPinByUserId(Long userId) {
        List<Pin> pins = pinRepository.findByUserId(userId);
        if (pins.isEmpty()) {
            throw new RuntimeException("No pins found for user id: " + userId);
        }
        return pins.stream()
                .map(PinResponseDTO::new)
                .collect(Collectors.toList());
    }

    public PinResponseDTO createPin(PinCreateDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));
                
        Pin pin = new Pin();
        pin.setTitle(dto.getTitle());
        pin.setDescription(dto.getDescription());
        pin.setLatitude(dto.getLatitude());
        pin.setLongitude(dto.getLongitude());
        pin.setImageUrl(dto.getImageUrl());
        pin.setUser(user);

        pin = pinRepository.save(pin);
        return new PinResponseDTO(pin);
    }

    public PinResponseDTO updatePin(Long id, PinUpdateDTO dto) {
        Pin pin = pinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pin not found with id: " + id));
        pin.setTitle(dto.getTitle());
        pin.setDescription(dto.getDescription());
    
        if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
            pin.setImageUrl(dto.getImageUrl());
        }
        
        pin = pinRepository.save(pin);
        return new PinResponseDTO(pin);
    }

    public void deletePin(Long id) {
        pinRepository.deleteById(id);
    }
}
