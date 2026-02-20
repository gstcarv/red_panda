package com.maplewood.application.student.usecase;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.application.course.mapper.CourseMapper;
import com.maplewood.application.coursesection.dto.CourseSectionDTO;
import com.maplewood.application.coursesection.mapper.CourseSectionMapper;
import com.maplewood.application.student.dto.EnrollmentDTO;
import com.maplewood.application.student.dto.EnrollmentResponseDTO;
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
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class CreateEnrollmentUseCase {

    private final EnrollmentRepositoryPort enrollmentRepositoryPort;
    private final CourseRepositoryPort courseRepositoryPort;
    private final CourseSectionRepositoryPort courseSectionRepositoryPort;
    private final SemesterRepositoryPort semesterRepositoryPort;
    private final TeacherRepositoryPort teacherRepositoryPort;
    private final CourseMapper courseMapper;
    private final CourseSectionMapper courseSectionMapper;

    public CreateEnrollmentUseCase(
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

    @Transactional
    public EnrollmentResponseDTO execute(Integer studentId, Integer courseId, Integer sectionId) {
        Semester activeSemester = semesterRepositoryPort.findActiveSemester()
                .orElseThrow(ActiveSemesterNotFoundException::new);

        Enrollment enrollment = enrollmentRepositoryPort.findByStudentIdAndCourseIdAndSemesterId(
                        studentId, courseId, activeSemester.getId())
                .orElseGet(() -> enrollmentRepositoryPort.save(
                        new Enrollment(
                                null,
                                studentId,
                                courseId,
                                sectionId,
                                activeSemester.getId(),
                                null
                        )));

        return new EnrollmentResponseDTO(
                toEnrollmentDto(enrollment, activeSemester)
        );
    }

    private EnrollmentDTO toEnrollmentDto(Enrollment enrollment, Semester activeSemester) {
        Course course = courseRepositoryPort.findById(enrollment.getCourseId())
                .orElseThrow(() -> new CourseNotFoundException(enrollment.getCourseId()));

        List<CourseSection> sections = courseSectionRepositoryPort.findByCourseIdAndSemesterId(
                enrollment.getCourseId(),
                activeSemester.getId()
        );

        CourseSection section = sections.stream()
                .filter(value -> Objects.equals(value.getId(), enrollment.getSectionId()))
                .findFirst()
                .orElseThrow(() -> new CourseSectionNotFoundException(enrollment.getSectionId()));

        Map<Integer, Teacher> teachersById = teacherRepositoryPort.findAllById(List.of(section.getTeacherId()))
                .stream()
                .collect(Collectors.toMap(Teacher::getId, teacher -> teacher));

        CourseDTO courseDTO = courseMapper.toDTO(course);
        courseDTO.setAvailableSections(List.of());

        CourseSectionDTO sectionDTO = courseSectionMapper.toDTO(section, teachersById);

        return new EnrollmentDTO(
                enrollment.getId(),
                courseDTO,
                sectionDTO,
                new SemesterSummaryDTO(
                        activeSemester.getId(),
                        activeSemester.getName(),
                        activeSemester.getYear(),
                        activeSemester.getOrderInYear()
                )
        );
    }
}
