package com.maplewood.infrastructure.persistence.adapter;

import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.coursesection.model.CourseSection.MeetingTime;
import com.maplewood.domain.coursesection.port.CourseSectionRepositoryPort;
import com.maplewood.infrastructure.persistence.entity.CourseSectionJpaEntity;
import com.maplewood.infrastructure.persistence.entity.CourseSectionMeetingTimeJpaEntity;
import com.maplewood.infrastructure.persistence.repository.CourseSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<CourseSection> findByCourseIdAndSemesterId(Integer courseId, Integer semesterId) {
        return courseSectionRepository.findByCourseIdAndSemesterId(courseId, semesterId)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
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
