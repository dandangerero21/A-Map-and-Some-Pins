package com.example.backend.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PinUpdateDTO {

    private String title;
    private String description;
    private String imageUrl;
}
