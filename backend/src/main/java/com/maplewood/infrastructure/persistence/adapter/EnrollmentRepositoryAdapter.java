package com.maplewood.infrastructure.persistence.adapter;

import com.maplewood.domain.enrollment.model.Enrollment;
import com.maplewood.domain.enrollment.port.EnrollmentRepositoryPort;
import com.maplewood.infrastructure.persistence.entity.EnrollmentJpaEntity;
import com.maplewood.infrastructure.persistence.repository.EnrollmentRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class EnrollmentRepositoryAdapter implements EnrollmentRepositoryPort {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentRepositoryAdapter(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    public List<Enrollment> findByStudentIdAndSemesterId(Integer studentId, Integer semesterId) {
        return enrollmentRepository.findByStudentIdAndSemesterId(studentId, semesterId)
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Enrollment> findByStudentIdAndCourseIdAndSemesterId(
            Integer studentId,
            Integer courseId,
            Integer semesterId
    ) {
        return enrollmentRepository.findByStudentIdAndCourseIdAndSemesterId(studentId, courseId, semesterId)
                .map(this::toDomain);
    }

    @Override
    public Enrollment save(Enrollment enrollment) {
        EnrollmentJpaEntity entity = toJpa(enrollment);
        EnrollmentJpaEntity saved = enrollmentRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(Integer id) {
        enrollmentRepository.deleteById(id);
    }

    private Enrollment toDomain(EnrollmentJpaEntity entity) {
        return new Enrollment(
                entity.getId(),
                entity.getStudentId(),
                entity.getCourseId(),
                entity.getSectionId(),
                entity.getSemesterId(),
                entity.getCreatedAt()
        );
    }

    private EnrollmentJpaEntity toJpa(Enrollment enrollment) {
        return new EnrollmentJpaEntity(
                enrollment.getId(),
                enrollment.getStudentId(),
                enrollment.getCourseId(),
                enrollment.getSectionId(),
                enrollment.getSemesterId(),
                enrollment.getCreatedAt()
        );
    }
}
