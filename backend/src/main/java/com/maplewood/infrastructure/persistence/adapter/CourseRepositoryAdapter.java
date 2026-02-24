package com.maplewood.infrastructure.persistence.adapter;

import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.model.CourseType;
import com.maplewood.domain.course.model.SemesterOrder;
import com.maplewood.domain.course.port.CourseRepositoryPort;
import com.maplewood.infrastructure.config.CacheConfig;
import com.maplewood.infrastructure.persistence.entity.CourseJpaEntity;
import com.maplewood.infrastructure.persistence.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adapter that implements CourseRepositoryPort using CourseRepository (JPA)
 * Part of Infrastructure Layer - adapts infrastructure to domain port
 */
@Component
public class CourseRepositoryAdapter implements CourseRepositoryPort {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseRepositoryAdapter(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_SEMESTER_CACHE, key = "'all-courses'")
    public List<Course> findAll() {
        return courseRepository.findAll()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSE_BY_ID_CACHE, key = "#id")
    public Optional<Course> findById(Integer id) {
        return courseRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Course> findAllById(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return courseRepository.findAllById(ids)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Course save(Course course) {
        CourseJpaEntity saved = courseRepository.save(toJpaEntity(course));
        return toDomain(saved);
    }

    @Override
    public void deleteById(Integer id) {
        courseRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Integer id) {
        return courseRepository.existsById(id);
    }

    private Course toDomain(CourseJpaEntity entity) {
        return new Course(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getDescription(),
                entity.getCredits(),
                entity.getHoursPerWeek(),
                entity.getSpecializationId(),
                entity.getPrerequisiteId(),
                CourseType.fromValue(entity.getCourseType()),
                entity.getGradeLevelMin(),
                entity.getGradeLevelMax(),
                SemesterOrder.fromValue(entity.getSemesterOrder()),
                entity.getCreatedAt()
        );
    }

    private CourseJpaEntity toJpaEntity(Course domain) {
        return new CourseJpaEntity(
                domain.getId(),
                domain.getCode(),
                domain.getName(),
                domain.getDescription(),
                domain.getCredits(),
                domain.getHoursPerWeek(),
                domain.getSpecializationId(),
                domain.getPrerequisiteId(),
                domain.getCourseType() == null ? null : domain.getCourseType().getValue(),
                domain.getGradeLevelMin(),
                domain.getGradeLevelMax(),
                domain.getSemesterOrder() == null ? null : domain.getSemesterOrder().getValue(),
                domain.getCreatedAt()
        );
    }
}
