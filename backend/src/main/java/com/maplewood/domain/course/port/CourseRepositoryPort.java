package com.maplewood.domain.course.port;

import com.maplewood.domain.course.model.Course;

import java.util.List;
import java.util.Optional;

/**
 * Port (interface) for Course repository
 * This is part of the domain layer - defines what the domain needs
 * Implementation is in infrastructure layer
 */
public interface CourseRepositoryPort {
    
    List<Course> findAll();
    
    Optional<Course> findById(Integer id);
    
    /**
     * Find all courses by their IDs (batch loading)
     */
    List<Course> findAllById(List<Integer> ids);
    
    Course save(Course course);
    
    void deleteById(Integer id);
    
    boolean existsById(Integer id);
}
