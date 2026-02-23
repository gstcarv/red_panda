package com.maplewood.infrastructure.persistence.adapter;

import com.maplewood.domain.coursehistory.model.CourseHistory;
import com.maplewood.domain.coursehistory.port.CourseHistoryRepositoryPort;
import com.maplewood.domain.student.model.StudentAcademicMetrics;
import com.maplewood.infrastructure.persistence.entity.StudentCourseHistoryJpaEntity;
import com.maplewood.infrastructure.persistence.repository.StudentAcademicMetricsProjection;
import com.maplewood.infrastructure.persistence.repository.StudentCourseHistoryRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CourseHistoryRepositoryAdapter implements CourseHistoryRepositoryPort {

    private final StudentCourseHistoryRepository studentCourseHistoryRepository;

    public CourseHistoryRepositoryAdapter(StudentCourseHistoryRepository studentCourseHistoryRepository) {
        this.studentCourseHistoryRepository = studentCourseHistoryRepository;
    }

    @Override
    public List<CourseHistory> findByStudentId(Integer studentId) {
        return studentCourseHistoryRepository.findByStudentId(studentId)
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public StudentAcademicMetrics findStudentAcademicMetrics(Integer studentId) {
        StudentAcademicMetricsProjection metrics = studentCourseHistoryRepository
                .findStudentAcademicMetricsByStudentId(studentId);

        if (metrics == null) {
            return new StudentAcademicMetrics(0, 0.0);
        }

        Integer creditsEarned = metrics.getCreditsEarned() == null ? 0 : metrics.getCreditsEarned();
        Double gpa = metrics.getCalculatedGpa() == null ? 0.0 : metrics.getCalculatedGpa();
        return new StudentAcademicMetrics(creditsEarned, gpa);
    }

    private CourseHistory toDomain(StudentCourseHistoryJpaEntity entity) {
        return new CourseHistory(
                entity.getId(),
                entity.getStudentId(),
                entity.getCourseId(),
                entity.getCourseSectionId(),
                entity.getSemesterId(),
                entity.getStatus(),
                entity.getCreatedAt()
        );
    }
}
