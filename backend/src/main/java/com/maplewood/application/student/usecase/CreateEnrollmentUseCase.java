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
import com.maplewood.domain.coursehistory.model.CourseHistory;
import com.maplewood.domain.coursehistory.port.CourseHistoryRepositoryPort;
import com.maplewood.domain.coursesection.exception.CourseSectionNotFoundException;
import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.coursesection.port.CourseSectionRepositoryPort;
import com.maplewood.domain.enrollment.model.Enrollment;
import com.maplewood.domain.enrollment.port.EnrollmentRepositoryPort;
import com.maplewood.domain.enrollment.service.EnrollmentEligibilityService;
import com.maplewood.domain.semester.exception.ActiveSemesterNotFoundException;
import com.maplewood.domain.semester.model.Semester;
import com.maplewood.domain.semester.port.SemesterRepositoryPort;
import com.maplewood.domain.student.exception.StudentNotFoundException;
import com.maplewood.domain.student.model.Student;
import com.maplewood.domain.student.port.StudentRepositoryPort;
import com.maplewood.domain.teacher.model.Teacher;
import com.maplewood.domain.teacher.port.TeacherRepositoryPort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CreateEnrollmentUseCase {

    private final EnrollmentRepositoryPort enrollmentRepositoryPort;
    private final CourseRepositoryPort courseRepositoryPort;
    private final CourseSectionRepositoryPort courseSectionRepositoryPort;
    private final SemesterRepositoryPort semesterRepositoryPort;
    private final TeacherRepositoryPort teacherRepositoryPort;
    private final StudentRepositoryPort studentRepositoryPort;
    private final CourseHistoryRepositoryPort courseHistoryRepositoryPort;
    private final EnrollmentEligibilityService enrollmentEligibilityService;
    private final CourseMapper courseMapper;
    private final CourseSectionMapper courseSectionMapper;

    public CreateEnrollmentUseCase(
            EnrollmentRepositoryPort enrollmentRepositoryPort,
            CourseRepositoryPort courseRepositoryPort,
            CourseSectionRepositoryPort courseSectionRepositoryPort,
            SemesterRepositoryPort semesterRepositoryPort,
            TeacherRepositoryPort teacherRepositoryPort,
            StudentRepositoryPort studentRepositoryPort,
            CourseHistoryRepositoryPort courseHistoryRepositoryPort,
            EnrollmentEligibilityService enrollmentEligibilityService,
            CourseMapper courseMapper,
            CourseSectionMapper courseSectionMapper
    ) {
        this.enrollmentRepositoryPort = enrollmentRepositoryPort;
        this.courseRepositoryPort = courseRepositoryPort;
        this.courseSectionRepositoryPort = courseSectionRepositoryPort;
        this.semesterRepositoryPort = semesterRepositoryPort;
        this.teacherRepositoryPort = teacherRepositoryPort;
        this.studentRepositoryPort = studentRepositoryPort;
        this.courseHistoryRepositoryPort = courseHistoryRepositoryPort;
        this.enrollmentEligibilityService = enrollmentEligibilityService;
        this.courseMapper = courseMapper;
        this.courseSectionMapper = courseSectionMapper;
    }

    @Transactional
    public EnrollmentResponseDTO execute(Integer studentId, Integer courseId, Integer sectionId) {
        Semester activeSemester = semesterRepositoryPort.findActiveSemester()
                .orElseThrow(ActiveSemesterNotFoundException::new);

        Enrollment existingEnrollment = enrollmentRepositoryPort.findByStudentIdAndCourseIdAndSemesterId(
                        studentId, courseId, activeSemester.getId())
                .orElse(null);

        if (existingEnrollment != null) {
            return new EnrollmentResponseDTO(
                    toEnrollmentDto(existingEnrollment, activeSemester)
            );
        }

        Student student = studentRepositoryPort.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("id: " + studentId));

        Course course = courseRepositoryPort.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        List<CourseSection> courseSections = courseSectionRepositoryPort.findByCourseIdAndSemesterId(
                courseId,
                activeSemester.getId()
        );
        CourseSection targetSection = courseSections.stream()
                .filter(section -> Objects.equals(section.getId(), sectionId))
                .findFirst()
                .orElseThrow(() -> new CourseSectionNotFoundException(sectionId));

        List<Enrollment> currentSemesterEnrollments = enrollmentRepositoryPort.findByStudentIdAndSemesterId(
                studentId,
                activeSemester.getId()
        );
        List<CourseHistory> courseHistory = courseHistoryRepositoryPort.findByStudentId(studentId);
        List<CourseSection> currentEnrollmentSections = findCurrentEnrollmentSections(
                currentSemesterEnrollments,
                activeSemester.getId()
        );

        enrollmentEligibilityService.canEnroll(
                student,
                course,
                targetSection,
                activeSemester,
                currentSemesterEnrollments,
                courseHistory,
                currentEnrollmentSections,
                null
        );

        Enrollment enrollment = enrollmentRepositoryPort.save(
                new Enrollment(
                        null,
                        studentId,
                        courseId,
                        sectionId,
                        activeSemester.getId(),
                        null
                ));

        return new EnrollmentResponseDTO(
                toEnrollmentDto(enrollment, activeSemester)
        );
    }

    private List<CourseSection> findCurrentEnrollmentSections(
            List<Enrollment> currentSemesterEnrollments,
            Integer semesterId
    ) {
        if (currentSemesterEnrollments == null || currentSemesterEnrollments.isEmpty()) {
            return List.of();
        }

        List<Integer> courseIds = currentSemesterEnrollments.stream()
                .map(Enrollment::getCourseId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        if (courseIds.isEmpty()) {
            return List.of();
        }

        Set<Integer> enrolledSectionIds = currentSemesterEnrollments.stream()
                .map(Enrollment::getSectionId)
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(HashSet::new));

        return courseSectionRepositoryPort.findByCourseIdInAndSemesterId(courseIds, semesterId)
                .stream()
                .filter(section -> enrolledSectionIds.contains(section.getId()))
                .toList();
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
