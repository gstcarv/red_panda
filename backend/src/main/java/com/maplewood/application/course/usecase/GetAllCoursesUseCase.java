package com.maplewood.application.course.usecase;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.application.course.mapper.CourseMapper;
import com.maplewood.application.coursesection.mapper.CourseSectionMapper;
import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.port.CourseRepositoryPort;
import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.coursesection.port.CourseSectionRepositoryPort;
import com.maplewood.domain.semester.model.Semester;
import com.maplewood.domain.semester.port.SemesterRepositoryPort;
import com.maplewood.domain.teacher.model.Teacher;
import com.maplewood.domain.teacher.port.TeacherRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Use case: get all courses.
 */
@Slf4j
@Component
public class GetAllCoursesUseCase {

    private final CourseRepositoryPort courseRepositoryPort;
    private final CourseMapper courseMapper;
    private final CourseSectionRepositoryPort courseSectionRepositoryPort;
    private final CourseSectionMapper courseSectionMapper;
    private final SemesterRepositoryPort semesterRepositoryPort;
    private final TeacherRepositoryPort teacherRepositoryPort;

    public GetAllCoursesUseCase(
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
    public List<CourseDTO> execute() {
        log.debug("Executing GetAllCoursesUseCase");
        
        // 1. Fetch all courses
        List<Course> courses = courseRepositoryPort.findAll();
        log.info("Found {} courses", courses.size());
        
        if (courses.isEmpty()) {
            return List.of();
        }

        // 2. Fetch active semester once
        Optional<Semester> activeSemesterOpt = semesterRepositoryPort.findActiveSemester();
        CourseDTO.SemesterDTO semesterDTO = null;
        Integer semesterId = null;
        if (activeSemesterOpt.isPresent()) {
            Semester semester = activeSemesterOpt.get();
            semesterId = semester.getId();
            semesterDTO = toSemesterDTO(semester);
        }

        // 3. Extract all course IDs and prerequisite IDs for batch loading
        List<Integer> courseIds = courses.stream()
                .map(Course::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        
        Set<Integer> prerequisiteIds = courses.stream()
                .map(Course::getPrerequisiteId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 4. Batch load all sections (if semester is active)
        Map<Integer, List<CourseSection>> sectionsByCourseId = new HashMap<>();
        Set<Integer> teacherIds = new HashSet<>();
        if (semesterId != null && !courseIds.isEmpty()) {
            List<CourseSection> allSections = courseSectionRepositoryPort.findByCourseIdInAndSemesterId(courseIds, semesterId);
            sectionsByCourseId = allSections.stream()
                    .collect(Collectors.groupingBy(CourseSection::getCourseId));
            // Extract teacher IDs for batch loading
            teacherIds = allSections.stream()
                    .map(CourseSection::getTeacherId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());
            log.debug("Loaded {} sections for {} courses", allSections.size(), courseIds.size());
        }

        // 5. Batch load all prerequisites
        Map<Integer, Course> prerequisitesById = new HashMap<>();
        if (!prerequisiteIds.isEmpty()) {
            List<Course> prerequisites = courseRepositoryPort.findAllById(new ArrayList<>(prerequisiteIds));
            prerequisitesById = prerequisites.stream()
                    .collect(Collectors.toMap(Course::getId, p -> p));
            log.debug("Loaded {} prerequisites", prerequisites.size());
        }

        // 6. Batch load all teachers
        Map<Integer, Teacher> teachersById = new HashMap<>();
        if (!teacherIds.isEmpty()) {
            List<Teacher> teachers = teacherRepositoryPort.findAllById(new ArrayList<>(teacherIds));
            teachersById = teachers.stream()
                    .collect(Collectors.toMap(Teacher::getId, t -> t));
            log.debug("Loaded {} teachers", teachers.size());
        }

        // 7. Create final maps for quick lookup
        final CourseDTO.SemesterDTO finalSemesterDTO = semesterDTO;
        final Map<Integer, List<CourseSection>> finalSectionsByCourseId = sectionsByCourseId;
        final Map<Integer, Course> finalPrerequisitesById = prerequisitesById;
        final Map<Integer, Teacher> finalTeachersById = teachersById;

        // 8. Enrich all courses using batch-loaded data
        return courses.stream()
                .map(course -> toEnrichedDto(course, finalSemesterDTO, finalSectionsByCourseId, finalPrerequisitesById, finalTeachersById))
                .toList();
    }

    private CourseDTO toEnrichedDto(
            Course course,
            CourseDTO.SemesterDTO semesterDTO,
            Map<Integer, List<CourseSection>> sectionsByCourseId,
            Map<Integer, Course> prerequisitesById,
            Map<Integer, Teacher> teachersById) {
        
        CourseDTO courseDTO = courseMapper.toDTO(course);
        
        if (course == null || course.getId() == null) {
            courseDTO.setAvailableSections(List.of());
            return courseDTO;
        }

        // Enrich with sections (from batch-loaded map, with teachers)
        List<CourseSection> sections = sectionsByCourseId.getOrDefault(course.getId(), List.of());
        courseDTO.setAvailableSections(courseSectionMapper.toDTOList(sections, teachersById));

        // Enrich with prerequisite (from batch-loaded map)
        if (course.getPrerequisiteId() != null) {
            Course prerequisite = prerequisitesById.get(course.getPrerequisiteId());
            if (prerequisite != null) {
                CourseDTO.CoursePrerequisiteDTO prerequisiteDTO = new CourseDTO.CoursePrerequisiteDTO(
                        prerequisite.getId(),
                        prerequisite.getCode(),
                        prerequisite.getName()
                );
                courseDTO.setPrerequisite(prerequisiteDTO);
            }
        }

        // Enrich with semester (same for all courses)
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
