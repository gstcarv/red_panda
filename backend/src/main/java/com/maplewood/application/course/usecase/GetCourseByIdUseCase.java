package com.maplewood.application.course.usecase;

import com.maplewood.domain.course.exception.CourseNotFoundException;
import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.port.CourseRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Use case: get course by id.
 */
@Slf4j
@Component
public class GetCourseByIdUseCase {

    private final CourseRepositoryPort courseRepositoryPort;

    public GetCourseByIdUseCase(CourseRepositoryPort courseRepositoryPort) {
        this.courseRepositoryPort = courseRepositoryPort;
    }

    @Transactional(readOnly = true)
    public Course execute(Integer id) {
        log.debug("Executing GetCourseByIdUseCase for course id: {}", id);
        Optional<Course> course = courseRepositoryPort.findById(id);
        
        if (course.isEmpty()) {
            log.warn("Course not found with id: {}", id);
            throw new CourseNotFoundException(id);
        }
        
        log.info("Found course with id: {}", id);
        return course.get();
    }
}
