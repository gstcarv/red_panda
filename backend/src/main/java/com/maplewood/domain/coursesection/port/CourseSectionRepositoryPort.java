package com.maplewood.domain.coursesection.port;

import com.maplewood.domain.coursesection.model.CourseSection;

import java.util.List;

/**
 * Port (interface) for CourseSection repository.
 * Defines the contract for CourseSection persistence operations.
 * Implementation belongs to Infrastructure layer.
 */
public interface CourseSectionRepositoryPort {

    /**
     * Find all course sections for a specific course in a specific semester
     */
    List<CourseSection> findByCourseIdAndSemesterId(Integer courseId, Integer semesterId);

    /**
     * Find all course sections for multiple courses in a specific semester (batch loading)
     */
    List<CourseSection> findByCourseIdInAndSemesterId(List<Integer> courseIds, Integer semesterId);
}
