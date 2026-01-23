package com.example.backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.Pin;

public interface PinRepository extends JpaRepository<Pin, Long> {
    List<Pin> findByUserId(Long userId);
}
