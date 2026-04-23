package com.example.weatherbackend.controllers;

import com.example.weatherbackend.dto.locationReqest;
import com.example.weatherbackend.models.FavoriteLocation;
import com.example.weatherbackend.services.logic;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorites")
@CrossOrigin(origins = "http://localhost:5500")
public class FavoriteLocationController {

    private final FavoriteLocationService favoriteLocationService;

    public FavoriteLocationController(FavoriteLocationService favoriteLocationService) {
        this.favoriteLocationService = favoriteLocationService;
    }

    @GetMapping
    public Iterable<FavoriteLocation> getAllFavorites() {
        return favoriteLocationService.getAllFavorites();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FavoriteLocation addFavorite(@Valid @RequestBody FavoriteLocationRequest request) {
        return favoriteLocationService.addFavorite(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFavorite(@PathVariable Long id) {
        favoriteLocationService.deleteFavorite(id);
    }
}