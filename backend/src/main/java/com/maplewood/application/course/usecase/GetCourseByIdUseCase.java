package com.maplewood.application.course.usecase;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.application.course.mapper.CourseMapper;
import com.maplewood.application.coursesection.mapper.CourseSectionMapper;
import com.maplewood.application.coursesection.usecase.GetCourseSectionsUseCase;
import com.maplewood.domain.course.exception.CourseNotFoundException;
import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.port.CourseRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Use case: get course by id.
 */
@Slf4j
@Component
public class GetCourseByIdUseCase {

    private final CourseRepositoryPort courseRepositoryPort;
    private final CourseMapper courseMapper;
    private final GetCourseSectionsUseCase getCourseSectionsUseCase;
    private final CourseSectionMapper courseSectionMapper;

    public GetCourseByIdUseCase(
            CourseRepositoryPort courseRepositoryPort,
            CourseMapper courseMapper,
            GetCourseSectionsUseCase getCourseSectionsUseCase,
            CourseSectionMapper courseSectionMapper) {
        this.courseRepositoryPort = courseRepositoryPort;
        this.courseMapper = courseMapper;
        this.getCourseSectionsUseCase = getCourseSectionsUseCase;
        this.courseSectionMapper = courseSectionMapper;
    }

    @Transactional(readOnly = true)
    public CourseDTO execute(Integer id) {
        log.debug("Executing GetCourseByIdUseCase for course id: {}", id);
        Optional<Course> course = courseRepositoryPort.findById(id);
        
        if (course.isEmpty()) {
            log.warn("Course not found with id: {}", id);
            throw new CourseNotFoundException(id);
        }
        
        log.info("Found course with id: {}", id);
        Course domainCourse = course.get();
        CourseDTO courseDTO = courseMapper.toDTO(domainCourse);
        if (domainCourse.getId() == null) {
            courseDTO.setAvailableSections(List.of());
            return courseDTO;
        }

        var sections = getCourseSectionsUseCase.execute(domainCourse.getId());
        courseDTO.setAvailableSections(courseSectionMapper.toDTOList(sections));
        return courseDTO;
    }
}
