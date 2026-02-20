package com.maplewood.domain.enrollment.port;

import com.maplewood.domain.enrollment.model.Enrollment;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepositoryPort {

    List<Enrollment> findByStudentIdAndSemesterId(Integer studentId, Integer semesterId);

    Optional<Enrollment> findByStudentIdAndCourseIdAndSemesterId(
            Integer studentId,
            Integer courseId,
            Integer semesterId
    );

    Enrollment save(Enrollment enrollment);

    void deleteById(Integer id);
}
