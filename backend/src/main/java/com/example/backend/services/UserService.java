package com.example.backend.services;

import com.example.backend.models.User;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.DTOs.UserCreateRequestDTO;
import com.example.backend.DTOs.UserResponseDTO;
import com.example.backend.repositories.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // service to create a new user
    public UserResponseDTO createUser(UserCreateRequestDTO dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent() || userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Username or email already exists");
        }
        
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // Hash password
        user.setEmail(dto.getEmail());
        User savedUser = userRepository.save(user);

        return new UserResponseDTO(savedUser);
    }

    // service to get all users
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }

    // service to get a user by ID
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return new UserResponseDTO(user);
    }

    // service to validate login
    public UserResponseDTO validateLogin(String usernameOrEmail, String password) {
        var userOpt = userRepository.findByUsername(usernameOrEmail);
        if (!userOpt.isPresent()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }
        
        User user = userOpt.orElseThrow(() -> new RuntimeException("User not found with username/email: " + usernameOrEmail));
        
        if (!passwordEncoder.matches(password, user.getPassword())) { // Verify hashed password
            throw new RuntimeException("Invalid password");
        }
        
        return new UserResponseDTO(user);
    }

    // service to update a user
    public UserResponseDTO updateUser(Long id, UserCreateRequestDTO dto){
        User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // Hash password
        User updatedUser = userRepository.save(user);
        return new UserResponseDTO(updatedUser);
    }

    // service to delete a user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
