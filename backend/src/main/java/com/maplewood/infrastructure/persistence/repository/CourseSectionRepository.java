package com.maplewood.infrastructure.persistence.repository;

import com.maplewood.infrastructure.persistence.entity.CourseSectionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for CourseSection
 * Part of Infrastructure Layer
 */
@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSectionJpaEntity, Integer> {
    
    /**
     * Find all course sections for a specific course in a specific semester
     */
    List<CourseSectionJpaEntity> findByCourseIdAndSemesterId(Integer courseId, Integer semesterId);
}
