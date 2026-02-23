package com.maplewood.infrastructure.persistence.adapter;

import com.maplewood.domain.teacher.model.Teacher;
import com.maplewood.domain.teacher.port.TeacherRepositoryPort;
import com.maplewood.infrastructure.config.CacheConfig;
import com.maplewood.infrastructure.persistence.entity.TeacherJpaEntity;
import com.maplewood.infrastructure.persistence.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adapter that implements TeacherRepositoryPort using TeacherRepository (JPA)
 * Part of Infrastructure Layer - adapts infrastructure to domain port
 */
@Component
public class TeacherRepositoryAdapter implements TeacherRepositoryPort {

    private final TeacherRepository teacherRepository;
    private final CacheManager cacheManager;

    @Autowired
    public TeacherRepositoryAdapter(TeacherRepository teacherRepository, CacheManager cacheManager) {
        this.teacherRepository = teacherRepository;
        this.cacheManager = cacheManager;
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.TEACHER_BY_ID_CACHE, key = "#id")
    public Optional<Teacher> findById(Integer id) {
        return teacherRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Teacher> findAllById(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        Cache cache = cacheManager.getCache(CacheConfig.TEACHER_BY_ID_CACHE);

        if (cache == null) {
            return teacherRepository.findAllById(ids)
                    .stream()
                    .map(this::toDomain)
                    .collect(Collectors.toList());
        }

        Map<Integer, Teacher> teachersById = new LinkedHashMap<>();
        List<Integer> missedIds = new ArrayList<>();
        for (Integer id : ids) {
            if (id == null || teachersById.containsKey(id)) {
                continue;
            }
            Teacher cachedTeacher = cache.get(id, Teacher.class);
            if (cachedTeacher != null) {
                teachersById.put(id, cachedTeacher);
            } else {
                missedIds.add(id);
            }
        }

        if (!missedIds.isEmpty()) {
            teacherRepository.findAllById(missedIds)
                    .stream()
                    .map(this::toDomain)
                    .forEach(teacher -> {
                        teachersById.put(teacher.getId(), teacher);
                        cache.put(teacher.getId(), teacher);
                    });
        }

        List<Teacher> orderedTeachers = new ArrayList<>();
        for (Integer id : ids) {
            if (id == null) {
                continue;
            }
            Teacher teacher = teachersById.get(id);
            if (teacher != null) {
                orderedTeachers.add(teacher);
            }
        }
        return orderedTeachers;
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
