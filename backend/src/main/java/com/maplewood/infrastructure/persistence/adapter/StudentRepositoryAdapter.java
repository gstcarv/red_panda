package com.maplewood.infrastructure.persistence.adapter;

import com.maplewood.domain.student.model.Student;
import com.maplewood.domain.student.port.StudentRepositoryPort;
import com.maplewood.infrastructure.persistence.entity.StudentJpaEntity;
import com.maplewood.infrastructure.persistence.repository.StudentRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Adapter that implements StudentRepositoryPort using StudentRepository (JPA).
 */
@Component
public class StudentRepositoryAdapter implements StudentRepositoryPort {

    private final StudentRepository studentRepository;

    public StudentRepositoryAdapter(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public Optional<Student> findById(Integer id) {
        return studentRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email).map(this::toDomain);
    }

    private Student toDomain(StudentJpaEntity entity) {
        return new Student(
                entity.getId(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getEmail(),
                entity.getGradeLevel(),
                entity.getEnrollmentYear(),
                entity.getExpectedGraduationYear(),
                entity.getStatus(),
                entity.getCreatedAt()
        );
    }
}
