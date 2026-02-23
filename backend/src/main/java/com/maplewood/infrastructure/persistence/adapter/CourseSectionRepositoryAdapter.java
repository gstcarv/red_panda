package com.maplewood.infrastructure.persistence.adapter;

import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.coursesection.model.CourseSection.MeetingTime;
import com.maplewood.domain.coursesection.port.CourseSectionRepositoryPort;
import com.maplewood.infrastructure.config.CacheConfig;
import com.maplewood.infrastructure.persistence.entity.CourseSectionJpaEntity;
import com.maplewood.infrastructure.persistence.repository.CourseSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Adapter that implements CourseSectionRepositoryPort using CourseSectionRepository (JPA)
 * Part of Infrastructure Layer - adapts infrastructure to domain port
 */
@Component
public class CourseSectionRepositoryAdapter implements CourseSectionRepositoryPort {

    private final CourseSectionRepository courseSectionRepository;

    @Autowired
    public CourseSectionRepositoryAdapter(CourseSectionRepository courseSectionRepository) {
        this.courseSectionRepository = courseSectionRepository;
    }

    @Override
    @Cacheable(
            cacheNames = CacheConfig.SECTIONS_BY_COURSE_SEMESTER_CACHE,
            key = "#courseId + ':' + #semesterId"
    )
    public List<CourseSection> findByCourseIdAndSemesterId(Integer courseId, Integer semesterId) {
        return courseSectionRepository.findByCourseIdAndSemesterId(courseId, semesterId)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(
            cacheNames = CacheConfig.SECTIONS_BY_COURSES_SEMESTER_CACHE,
            key = "T(com.maplewood.infrastructure.persistence.adapter.CourseSectionRepositoryAdapter).buildBatchKey(#courseIds, #semesterId)"
    )
    public List<CourseSection> findByCourseIdInAndSemesterId(List<Integer> courseIds, Integer semesterId) {
        if (courseIds == null || courseIds.isEmpty()) {
            return List.of();
        }
        return courseSectionRepository.findByCourseIdInAndSemesterId(courseIds, semesterId)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    public static String buildBatchKey(List<Integer> courseIds, Integer semesterId) {
        if (courseIds == null || courseIds.isEmpty()) {
            return "[]:" + semesterId;
        }
        String normalizedCourseIds = courseIds.stream()
                .filter(id -> id != null)
                .distinct()
                .sorted()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
        return normalizedCourseIds + ":" + semesterId;
    }

    private CourseSection toDomain(CourseSectionJpaEntity entity) {
        List<MeetingTime> meetingTimes = null;
        if (entity.getMeetingTimes() != null) {
            meetingTimes = entity.getMeetingTimes()
                    .stream()
                    .map(mt -> MeetingTime.builder()
                            .dayOfWeek(mt.getDayOfWeek())
                            .startTime(mt.getStartTime())
                            .endTime(mt.getEndTime())
                            .build())
                    .collect(Collectors.toList());
        }

        return CourseSection.builder()
                .id(entity.getId())
                .courseId(entity.getCourseId())
                .semesterId(entity.getSemesterId())
                .teacherId(entity.getTeacherId())
                .classroomId(entity.getClassroomId())
                .capacity(entity.getCapacity())
                .enrolledCount(entity.getEnrolledCount())
                .meetingTimes(meetingTimes)
                .build();
    }
}
