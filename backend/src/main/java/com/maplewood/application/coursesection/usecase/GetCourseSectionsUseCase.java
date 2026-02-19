package com.maplewood.application.coursesection.usecase;

import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.coursesection.port.CourseSectionRepositoryPort;
import com.maplewood.domain.semester.model.Semester;
import com.maplewood.domain.semester.port.SemesterRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Use case: get course sections for a course in the active semester
 */
@Slf4j
@Component
public class GetCourseSectionsUseCase {

    private final CourseSectionRepositoryPort courseSectionRepositoryPort;
    private final SemesterRepositoryPort semesterRepositoryPort;

    @Autowired
    public GetCourseSectionsUseCase(
            CourseSectionRepositoryPort courseSectionRepositoryPort,
            SemesterRepositoryPort semesterRepositoryPort) {
        this.courseSectionRepositoryPort = courseSectionRepositoryPort;
        this.semesterRepositoryPort = semesterRepositoryPort;
    }

    @Transactional(readOnly = true)
    public List<CourseSection> execute(Integer courseId) {
        log.debug("Executing GetCourseSectionsUseCase for course id: {}", courseId);
        
        // Find active semester
        Optional<Semester> activeSemesterOpt = semesterRepositoryPort.findActiveSemester();
        if (activeSemesterOpt.isEmpty()) {
            log.warn("No active semester found");
            return List.of();
        }
        
        Integer semesterId = activeSemesterOpt.get().getId();
        List<CourseSection> sections = courseSectionRepositoryPort.findByCourseIdAndSemesterId(courseId, semesterId);
        
        log.info("Found {} sections for course id: {} in semester id: {}", sections.size(), courseId, semesterId);
        return sections;
    }
}
