package com.maplewood.domain.teacher.port;

import com.maplewood.domain.teacher.model.Teacher;

import java.util.List;
import java.util.Optional;

/**
 * Port (interface) for Teacher repository
 * This is part of the domain layer - defines what the domain needs
 * Implementation is in infrastructure layer
 */
public interface TeacherRepositoryPort {
    
    /**
     * Find teacher by id
     */
    Optional<Teacher> findById(Integer id);
    
    /**
     * Find all teachers by their IDs (batch loading)
     */
    List<Teacher> findAllById(List<Integer> ids);
}
