package com.maplewood.infrastructure.persistence.adapter;

import com.maplewood.domain.semester.model.Semester;
import com.maplewood.domain.semester.port.SemesterRepositoryPort;
import com.maplewood.infrastructure.persistence.entity.SemesterJpaEntity;
import com.maplewood.infrastructure.persistence.repository.SemesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Adapter that implements SemesterRepositoryPort using SemesterRepository (JPA)
 * Part of Infrastructure Layer - adapts infrastructure to domain port
 */
@Component
public class SemesterRepositoryAdapter implements SemesterRepositoryPort {

    private final SemesterRepository semesterRepository;

    @Autowired
    public SemesterRepositoryAdapter(SemesterRepository semesterRepository) {
        this.semesterRepository = semesterRepository;
    }

    @Override
    public Optional<Semester> findActiveSemester() {
        return semesterRepository.findByIsActiveTrue()
                .map(this::toDomain);
    }

    private Semester toDomain(SemesterJpaEntity entity) {
        return new Semester(
                entity.getId(),
                entity.getName(),
                entity.getYear(),
                entity.getOrderInYear(),
                entity.getStartDate(),
                entity.getEndDate(),
                entity.getIsActive(),
                entity.getCreatedAt()
        );
    }
}
