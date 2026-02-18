package com.maplewood.infrastructure.persistence.repository;

import com.maplewood.infrastructure.persistence.entity.CourseJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Infrastructure implementation of Course repository
 * Uses Spring Data JPA for persistence
 * Part of Infrastructure Layer
 * 
 * Note: CourseRepositoryPort is implemented via adapter pattern in CourseRepositoryAdapter
 */
@Repository
public interface CourseRepository extends JpaRepository<CourseJpaEntity, Integer> {

    /**
     * Find courses filtered by grade level
     * @param gradeLevel Minimum grade level
     * @return List of courses available for the grade level
     */
    @Query("SELECT c FROM CourseJpaEntity c WHERE c.gradeLevelMin <= :gradeLevel AND c.gradeLevelMax >= :gradeLevel")
    List<CourseJpaEntity> findByGradeLevel(@Param("gradeLevel") Integer gradeLevel);

    /**
     * Find courses by semester order
     * @param semesterOrder Semester order (1 = Fall, 2 = Spring)
     * @return List of courses for the semester
     */
    List<CourseJpaEntity> findBySemesterOrder(Integer semesterOrder);

    /**
     * Find courses filtered by grade level and semester
     * @param gradeLevel Minimum grade level
     * @param semesterOrder Semester order (1 = Fall, 2 = Spring)
     * @return List of courses matching both filters
     */
    @Query("SELECT c FROM CourseJpaEntity c WHERE c.gradeLevelMin <= :gradeLevel AND c.gradeLevelMax >= :gradeLevel AND c.semesterOrder = :semesterOrder")
    List<CourseJpaEntity> findByGradeLevelAndSemesterOrder(@Param("gradeLevel") Integer gradeLevel, @Param("semesterOrder") Integer semesterOrder);
}
