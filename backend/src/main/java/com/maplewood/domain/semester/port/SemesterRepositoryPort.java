package com.maplewood.domain.semester.port;

import com.maplewood.domain.semester.model.Semester;

import java.util.Optional;

/**
 * Port (interface) for Semester repository
 * This is part of the domain layer - defines what the domain needs
 * Implementation is in infrastructure layer
 */
public interface SemesterRepositoryPort {

    Optional<Semester> findById(Integer id);
    
    /**
     * Find the active semester
     */
    Optional<Semester> findActiveSemester();
}
