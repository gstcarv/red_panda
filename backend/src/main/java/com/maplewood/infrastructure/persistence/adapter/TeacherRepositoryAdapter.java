package com.maplewood.infrastructure.persistence.adapter;

import com.maplewood.domain.teacher.model.Teacher;
import com.maplewood.domain.teacher.port.TeacherRepositoryPort;
import com.maplewood.infrastructure.persistence.entity.TeacherJpaEntity;
import com.maplewood.infrastructure.persistence.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adapter that implements TeacherRepositoryPort using TeacherRepository (JPA)
 * Part of Infrastructure Layer - adapts infrastructure to domain port
 */
@Component
public class TeacherRepositoryAdapter implements TeacherRepositoryPort {

    private final TeacherRepository teacherRepository;

    @Autowired
    public TeacherRepositoryAdapter(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    @Override
    public Optional<Teacher> findById(Integer id) {
        return teacherRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Teacher> findAllById(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return teacherRepository.findAllById(ids)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private Teacher toDomain(TeacherJpaEntity entity) {
        return new Teacher(
                entity.getId(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getSpecializationId(),
                entity.getEmail(),
                entity.getMaxDailyHours(),
                entity.getCreatedAt()
        );
    }
}
