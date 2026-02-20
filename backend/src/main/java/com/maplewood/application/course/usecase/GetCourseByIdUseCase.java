package com.maplewood.application.course.usecase;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.application.course.mapper.CourseMapper;
import com.maplewood.application.coursesection.mapper.CourseSectionMapper;
import com.maplewood.domain.course.exception.CourseNotFoundException;
import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.port.CourseRepositoryPort;
import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.coursesection.port.CourseSectionRepositoryPort;
import com.maplewood.domain.semester.model.Semester;
import com.maplewood.domain.semester.exception.SemesterNotFoundException;
import com.maplewood.domain.semester.port.SemesterRepositoryPort;
import com.maplewood.domain.teacher.model.Teacher;
import com.maplewood.domain.teacher.port.TeacherRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Use case: get course by id.
 */
@Slf4j
@Component
public class GetCourseByIdUseCase {

    private final CourseRepositoryPort courseRepositoryPort;
    private final CourseMapper courseMapper;
    private final CourseSectionRepositoryPort courseSectionRepositoryPort;
    private final CourseSectionMapper courseSectionMapper;
    private final SemesterRepositoryPort semesterRepositoryPort;
    private final TeacherRepositoryPort teacherRepositoryPort;

    public GetCourseByIdUseCase(
            CourseRepositoryPort courseRepositoryPort,
            CourseMapper courseMapper,
            CourseSectionRepositoryPort courseSectionRepositoryPort,
            CourseSectionMapper courseSectionMapper,
            SemesterRepositoryPort semesterRepositoryPort,
            TeacherRepositoryPort teacherRepositoryPort) {
        this.courseRepositoryPort = courseRepositoryPort;
        this.courseMapper = courseMapper;
        this.courseSectionRepositoryPort = courseSectionRepositoryPort;
        this.courseSectionMapper = courseSectionMapper;
        this.semesterRepositoryPort = semesterRepositoryPort;
        this.teacherRepositoryPort = teacherRepositoryPort;
    }

    @Transactional(readOnly = true)
    public CourseDTO execute(Integer id, Integer semesterId) {
        log.debug("Executing GetCourseByIdUseCase for course id: {} and semesterId: {}", id, semesterId);
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

        // Fetch requested semester when provided; otherwise fallback to active semester
        Optional<Semester> selectedSemesterOpt = semesterId != null
                ? semesterRepositoryPort.findById(semesterId)
                : semesterRepositoryPort.findActiveSemester();
        if (semesterId != null && selectedSemesterOpt.isEmpty()) {
            throw new SemesterNotFoundException(semesterId);
        }

        CourseDTO.SemesterDTO semesterDTO = null;
        Integer resolvedSemesterId = null;
        if (selectedSemesterOpt.isPresent()) {
            Semester semester = selectedSemesterOpt.get();
            resolvedSemesterId = semester.getId();
            semesterDTO = toSemesterDTO(semester);
        }

        // Enrich with sections (using the semester we already fetched)
        List<CourseSection> sections = List.of();
        Map<Integer, Teacher> teachersById = new HashMap<>();
        if (resolvedSemesterId != null) {
            sections = courseSectionRepositoryPort.findByCourseIdAndSemesterId(domainCourse.getId(), resolvedSemesterId);
            // Batch load teachers for sections
            if (!sections.isEmpty()) {
                Set<Integer> teacherIds = sections.stream()
                        .map(CourseSection::getTeacherId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());
                if (!teacherIds.isEmpty()) {
                    List<Teacher> teachers = teacherRepositoryPort.findAllById(new ArrayList<>(teacherIds));
                    teachersById = teachers.stream()
                            .collect(Collectors.toMap(Teacher::getId, t -> t));
                }
            }
        }
        courseDTO.setAvailableSections(courseSectionMapper.toDTOList(sections, teachersById));

        // Enrich with prerequisite
        if (domainCourse.getPrerequisiteId() != null) {
            Optional<Course> prerequisiteCourse = courseRepositoryPort.findById(domainCourse.getPrerequisiteId());
            if (prerequisiteCourse.isPresent()) {
                Course prereq = prerequisiteCourse.get();
                CourseDTO.CoursePrerequisiteDTO prerequisiteDTO = new CourseDTO.CoursePrerequisiteDTO(
                        prereq.getId(),
                        prereq.getCode(),
                        prereq.getName()
                );
                courseDTO.setPrerequisite(prerequisiteDTO);
            }
        }

        // Enrich with semester
        courseDTO.setSemester(semesterDTO);

        return courseDTO;
    }

    private CourseDTO.SemesterDTO toSemesterDTO(Semester semester) {
        return new CourseDTO.SemesterDTO(
                semester.getId(),
                semester.getName(),
                semester.getYear(),
                semester.getOrderInYear()
        );
    }
}
