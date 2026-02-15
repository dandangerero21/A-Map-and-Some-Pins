package com.example.backend.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.DTOs.UserCreateRequestDTO;
import com.example.backend.DTOs.UserResponseDTO;
import com.example.backend.services.UserService;

@CrossOrigin({"http://localhost:5173", "https://a-map-and-some-pins.vercel.app"})
@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponseDTO createUser(@RequestBody UserCreateRequestDTO dto) {
       return userService.createUser(dto);
    }

    @GetMapping
    public java.util.List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }


    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody UserCreateRequestDTO dto) {
        return userService.validateLogin(dto.getUsernameOrEmail(), dto.getPassword());
    }
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable Long id, @RequestBody UserCreateRequestDTO dto) {
        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
