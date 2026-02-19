package com.maplewood.application.course.usecase;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.application.course.mapper.CourseMapper;
import com.maplewood.application.coursesection.mapper.CourseSectionMapper;
import com.maplewood.application.coursesection.usecase.GetCourseSectionsUseCase;
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
    private final CourseMapper courseMapper;
    private final GetCourseSectionsUseCase getCourseSectionsUseCase;
    private final CourseSectionMapper courseSectionMapper;

    public GetAllCoursesUseCase(
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
    public List<CourseDTO> execute() {
        log.debug("Executing GetAllCoursesUseCase");
        List<Course> courses = courseRepositoryPort.findAll();
        log.info("Found {} courses", courses.size());

        return courses.stream()
                .map(this::toEnrichedDto)
                .toList();
    }

    private CourseDTO toEnrichedDto(Course course) {
        CourseDTO courseDTO = courseMapper.toDTO(course);
        if (course == null || course.getId() == null) {
            courseDTO.setAvailableSections(List.of());
            return courseDTO;
        }

        var sections = getCourseSectionsUseCase.execute(course.getId());
        courseDTO.setAvailableSections(courseSectionMapper.toDTOList(sections));
        return courseDTO;
    }
}
