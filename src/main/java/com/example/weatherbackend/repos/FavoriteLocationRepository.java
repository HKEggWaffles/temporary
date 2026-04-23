package com.example.weatherbackend.repos;

import com.example.weatherbackend.models.FavoriteLocation;
import org.springframework.data.repository.CrudRepository;

public interface FavoriteLocationRepository extends CrudRepository<FavoriteLocation, Long> {
}