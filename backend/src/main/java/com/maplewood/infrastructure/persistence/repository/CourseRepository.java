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
}
