package com.maplewood.application.student.usecase;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.application.course.mapper.CourseMapper;
import com.maplewood.application.coursesection.dto.CourseSectionDTO;
import com.maplewood.application.coursesection.mapper.CourseSectionMapper;
import com.maplewood.application.student.dto.EnrollmentDTO;
import com.maplewood.application.student.dto.EnrollmentsResponseDTO;
import com.maplewood.application.student.dto.SemesterSummaryDTO;
import com.maplewood.domain.course.exception.CourseNotFoundException;
import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.port.CourseRepositoryPort;
import com.maplewood.domain.coursesection.exception.CourseSectionNotFoundException;
import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.coursesection.port.CourseSectionRepositoryPort;
import com.maplewood.domain.enrollment.model.Enrollment;
import com.maplewood.domain.enrollment.port.EnrollmentRepositoryPort;
import com.maplewood.domain.semester.exception.ActiveSemesterNotFoundException;
import com.maplewood.domain.semester.model.Semester;
import com.maplewood.domain.semester.port.SemesterRepositoryPort;
import com.maplewood.domain.teacher.model.Teacher;
import com.maplewood.domain.teacher.port.TeacherRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
public class GetMyEnrollmentsUseCase {

    private final EnrollmentRepositoryPort enrollmentRepositoryPort;
    private final CourseRepositoryPort courseRepositoryPort;
    private final CourseSectionRepositoryPort courseSectionRepositoryPort;
    private final SemesterRepositoryPort semesterRepositoryPort;
    private final TeacherRepositoryPort teacherRepositoryPort;
    private final CourseMapper courseMapper;
    private final CourseSectionMapper courseSectionMapper;

    public GetMyEnrollmentsUseCase(
            EnrollmentRepositoryPort enrollmentRepositoryPort,
            CourseRepositoryPort courseRepositoryPort,
            CourseSectionRepositoryPort courseSectionRepositoryPort,
            SemesterRepositoryPort semesterRepositoryPort,
            TeacherRepositoryPort teacherRepositoryPort,
            CourseMapper courseMapper,
            CourseSectionMapper courseSectionMapper
    ) {
        this.enrollmentRepositoryPort = enrollmentRepositoryPort;
        this.courseRepositoryPort = courseRepositoryPort;
        this.courseSectionRepositoryPort = courseSectionRepositoryPort;
        this.semesterRepositoryPort = semesterRepositoryPort;
        this.teacherRepositoryPort = teacherRepositoryPort;
        this.courseMapper = courseMapper;
        this.courseSectionMapper = courseSectionMapper;
    }

    @Transactional(readOnly = true)
    public EnrollmentsResponseDTO execute(Integer studentId) {
        Semester activeSemester = semesterRepositoryPort.findActiveSemester()
                .orElseThrow(ActiveSemesterNotFoundException::new);

        List<Enrollment> enrollments = enrollmentRepositoryPort.findByStudentIdAndSemesterId(studentId, activeSemester.getId());
        if (enrollments.isEmpty()) {
            return new EnrollmentsResponseDTO(List.of());
        }

        List<Integer> courseIds = enrollments.stream()
                .map(Enrollment::getCourseId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        Map<Integer, Course> coursesById = courseRepositoryPort.findAllById(courseIds)
                .stream()
                .collect(Collectors.toMap(Course::getId, course -> course));

        List<CourseSection> sections = courseSectionRepositoryPort.findByCourseIdInAndSemesterId(courseIds, activeSemester.getId());
        Map<Integer, CourseSection> sectionsById = sections.stream()
                .collect(Collectors.toMap(CourseSection::getId, section -> section));

        Set<Integer> teacherIds = sections.stream()
                .map(CourseSection::getTeacherId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Integer, Teacher> teachersById = new HashMap<>();
        if (!teacherIds.isEmpty()) {
            teachersById = teacherRepositoryPort.findAllById(new ArrayList<>(teacherIds))
                    .stream()
                    .collect(Collectors.toMap(Teacher::getId, teacher -> teacher));
        }

        SemesterSummaryDTO semesterSummary = toSemesterSummary(activeSemester);
        Map<Integer, Teacher> finalTeachersById = teachersById;

        List<EnrollmentDTO> items = enrollments.stream()
                .map(enrollment -> toDto(enrollment, coursesById, sectionsById, finalTeachersById, semesterSummary))
                .toList();

        log.info("Found {} enrollments for student id {}", items.size(), studentId);
        return new EnrollmentsResponseDTO(items);
    }

    private EnrollmentDTO toDto(
            Enrollment enrollment,
            Map<Integer, Course> coursesById,
            Map<Integer, CourseSection> sectionsById,
            Map<Integer, Teacher> teachersById,
            SemesterSummaryDTO semester
    ) {
        Course course = coursesById.get(enrollment.getCourseId());
        if (course == null) {
            throw new CourseNotFoundException(enrollment.getCourseId());
        }

        CourseSection section = sectionsById.get(enrollment.getSectionId());
        if (section == null) {
            throw new CourseSectionNotFoundException(enrollment.getSectionId());
        }

        CourseDTO courseDTO = courseMapper.toDTO(course);
        courseDTO.setAvailableSections(List.of());

        CourseSectionDTO sectionDTO = courseSectionMapper.toDTO(section, teachersById);

        return new EnrollmentDTO(
                enrollment.getId(),
                courseDTO,
                sectionDTO,
                semester
        );
    }

    private SemesterSummaryDTO toSemesterSummary(Semester semester) {
        return new SemesterSummaryDTO(
                semester.getId(),
                semester.getName(),
                semester.getYear(),
                semester.getOrderInYear()
        );
    }
}
