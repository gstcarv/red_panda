package com.maplewood.domain.coursehistory.port;

import com.maplewood.domain.coursehistory.model.CourseHistory;
import com.maplewood.domain.student.model.StudentAcademicMetrics;

import java.util.List;

public interface CourseHistoryRepositoryPort {

    List<CourseHistory> findByStudentId(Integer studentId);

    StudentAcademicMetrics findStudentAcademicMetrics(Integer studentId);
}
