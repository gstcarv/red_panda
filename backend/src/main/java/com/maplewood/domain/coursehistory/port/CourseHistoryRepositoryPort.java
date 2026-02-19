package com.maplewood.domain.coursehistory.port;

import com.maplewood.domain.coursehistory.model.CourseHistory;

import java.util.List;

public interface CourseHistoryRepositoryPort {

    List<CourseHistory> findByStudentId(Integer studentId);
}
