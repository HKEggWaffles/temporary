package com.example.weatherbackend.controllers;

import com.example.weatherbackend.models.FavoriteLocation;
import com.example.weatherbackend.repos.FavoriteLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorites")
@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
public class FavoriteLocationController {

    @Autowired
    private FavoriteLocationRepository favoriteLocationRepository;

    @GetMapping
    public Iterable<FavoriteLocation> getAllFavorites() {
        return favoriteLocationRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FavoriteLocation addFavorite(@RequestBody FavoriteLocation favoriteLocation) {
        return favoriteLocationRepository.save(favoriteLocation);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFavorite(@PathVariable Long id) {
        favoriteLocationRepository.deleteById(id);
    }
}