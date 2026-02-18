package com.maplewood.application.course.usecase;

import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.port.CourseRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Use case: get all courses.
 */
@Slf4j
@Component
public class GetAllCoursesUseCase {

    private final CourseRepositoryPort courseRepositoryPort;

    public GetAllCoursesUseCase(CourseRepositoryPort courseRepositoryPort) {
        this.courseRepositoryPort = courseRepositoryPort;
    }

    @Transactional(readOnly = true)
    public List<Course> execute() {
        log.debug("Executing GetAllCoursesUseCase");
        List<Course> courses = courseRepositoryPort.findAll();
        log.info("Found {} courses", courses.size());
        return courses;
    }
}
