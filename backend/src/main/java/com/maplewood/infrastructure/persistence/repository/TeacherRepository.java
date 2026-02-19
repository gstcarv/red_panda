package com.maplewood.infrastructure.persistence.repository;

import com.maplewood.infrastructure.persistence.entity.TeacherJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA Repository for Teacher
 * Part of Infrastructure Layer
 */
@Repository
public interface TeacherRepository extends JpaRepository<TeacherJpaEntity, Integer> {
}
