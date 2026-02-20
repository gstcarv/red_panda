package com.maplewood.infrastructure.persistence.repository;

import com.maplewood.infrastructure.persistence.entity.EnrollmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<EnrollmentJpaEntity, Integer> {

    List<EnrollmentJpaEntity> findByStudentIdAndSemesterId(Integer studentId, Integer semesterId);

    Optional<EnrollmentJpaEntity> findByStudentIdAndCourseIdAndSemesterId(
            Integer studentId,
            Integer courseId,
            Integer semesterId
    );
}
