package com.maplewood.infrastructure.persistence.repository;

import com.maplewood.infrastructure.persistence.entity.StudentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for Student.
 */
@Repository
public interface StudentRepository extends JpaRepository<StudentJpaEntity, Integer> {

    Optional<StudentJpaEntity> findByEmail(String email);
}
