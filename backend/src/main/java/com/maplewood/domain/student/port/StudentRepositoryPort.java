package com.maplewood.domain.student.port;

import com.maplewood.domain.student.model.Student;

import java.util.Optional;

/**
 * Port (interface) for Student repository.
 */
public interface StudentRepositoryPort {

    /**
     * Find student by id.
     */
    Optional<Student> findById(Integer id);

    /**
     * Find student by email.
     */
    Optional<Student> findByEmail(String email);
}
