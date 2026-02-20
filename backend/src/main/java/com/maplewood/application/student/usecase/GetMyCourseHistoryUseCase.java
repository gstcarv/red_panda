package com.maplewood.application.student.usecase;

import com.maplewood.application.student.dto.CourseHistoryDTO;
import com.maplewood.application.student.dto.CourseHistoryResponseDTO;
import com.maplewood.application.student.dto.EnrollmentSummaryDTO;
import com.maplewood.application.student.dto.SemesterSummaryDTO;
import com.maplewood.domain.course.exception.CourseNotFoundException;
import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.port.CourseRepositoryPort;
import com.maplewood.domain.coursehistory.model.CourseHistory;
import com.maplewood.domain.coursehistory.port.CourseHistoryRepositoryPort;
import com.maplewood.domain.enrollment.model.Enrollment;
import com.maplewood.domain.enrollment.port.EnrollmentRepositoryPort;
import com.maplewood.domain.semester.exception.SemesterNotFoundException;
import com.maplewood.domain.semester.model.Semester;
import com.maplewood.domain.semester.port.SemesterRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Component
public class GetMyCourseHistoryUseCase {

    private final CourseHistoryRepositoryPort courseHistoryRepositoryPort;
    private final CourseRepositoryPort courseRepositoryPort;
    private final SemesterRepositoryPort semesterRepositoryPort;
    private final EnrollmentRepositoryPort enrollmentRepositoryPort;

    public GetMyCourseHistoryUseCase(
            CourseHistoryRepositoryPort courseHistoryRepositoryPort,
            CourseRepositoryPort courseRepositoryPort,
            SemesterRepositoryPort semesterRepositoryPort,
            EnrollmentRepositoryPort enrollmentRepositoryPort) {
        this.courseHistoryRepositoryPort = courseHistoryRepositoryPort;
        this.courseRepositoryPort = courseRepositoryPort;
        this.semesterRepositoryPort = semesterRepositoryPort;
        this.enrollmentRepositoryPort = enrollmentRepositoryPort;
    }

    @Transactional(readOnly = true)
    public CourseHistoryResponseDTO execute(Integer studentId) {
        log.info("Getting course history for student id: {}", studentId);

        List<CourseHistory> historyRows = courseHistoryRepositoryPort.findByStudentId(studentId);
        if (historyRows.isEmpty()) {
            return new CourseHistoryResponseDTO(List.of());
        }

        List<Integer> courseIds = historyRows.stream()
                .map(CourseHistory::getCourseId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        Map<Integer, Course> coursesById = courseRepositoryPort.findAllById(courseIds)
                .stream()
                .collect(Collectors.toMap(Course::getId, c -> c));

        Map<Integer, SemesterSummaryDTO> semesterById = historyRows.stream()
                .map(CourseHistory::getSemesterId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toMap(
                        semesterId -> semesterId,
                        this::fetchSemesterSummary
                ));

        Map<CourseSemesterKey, Enrollment> enrollmentByCourseSemester = historyRows.stream()
                .map(CourseHistory::getSemesterId)
                .filter(Objects::nonNull)
                .distinct()
                .map(semesterId -> enrollmentRepositoryPort.findByStudentIdAndSemesterId(studentId, semesterId))
                .flatMap(List::stream)
                .filter(enrollment -> enrollment.getCourseId() != null && enrollment.getSemesterId() != null)
                .collect(Collectors.toMap(
                        enrollment -> new CourseSemesterKey(enrollment.getCourseId(), enrollment.getSemesterId()),
                        enrollment -> enrollment,
                        (existing, ignored) -> existing
                ));

        List<CourseHistoryDTO> items = historyRows.stream()
                .map(row -> toCourseHistoryDTO(row, coursesById, semesterById, enrollmentByCourseSemester))
                .toList();

        return new CourseHistoryResponseDTO(items);
    }

    private CourseHistoryDTO toCourseHistoryDTO(
            CourseHistory row,
            Map<Integer, Course> coursesById,
            Map<Integer, SemesterSummaryDTO> semestersById,
            Map<CourseSemesterKey, Enrollment> enrollmentByCourseSemester) {
        Course course = coursesById.get(row.getCourseId());
        if (course == null) {
            throw new CourseNotFoundException(row.getCourseId());
        }

        SemesterSummaryDTO semester = semestersById.get(row.getSemesterId());
        if (semester == null) {
            throw new SemesterNotFoundException(row.getSemesterId());
        }

        Enrollment enrollment = enrollmentByCourseSemester.get(
                new CourseSemesterKey(row.getCourseId(), row.getSemesterId())
        );
        EnrollmentSummaryDTO enrollmentSummary = enrollment == null
                ? null
                : new EnrollmentSummaryDTO(enrollment.getSectionId());

        return new CourseHistoryDTO(
                row.getId(),
                row.getCourseId(),
                course.getName(),
                semester,
                row.getStatus(),
                enrollmentSummary
        );
    }

    private SemesterSummaryDTO fetchSemesterSummary(Integer semesterId) {
        Semester semester = semesterRepositoryPort.findById(semesterId)
                .orElseThrow(() -> new SemesterNotFoundException(semesterId));

        return new SemesterSummaryDTO(
                semester.getId(),
                semester.getName(),
                semester.getYear(),
                semester.getOrderInYear()
        );
    }

    private record CourseSemesterKey(Integer courseId, Integer semesterId) {
    }
}
