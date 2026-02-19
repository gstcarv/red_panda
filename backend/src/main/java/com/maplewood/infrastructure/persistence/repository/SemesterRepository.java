package com.maplewood.infrastructure.persistence.repository;

import com.maplewood.infrastructure.persistence.entity.SemesterJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for Semester
 * Part of Infrastructure Layer
 */
@Repository
public interface SemesterRepository extends JpaRepository<SemesterJpaEntity, Integer> {
    
    /**
     * Find the active semester
     */
    Optional<SemesterJpaEntity> findByIsActiveTrue();
}
