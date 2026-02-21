package com.maplewood.application.student.usecase;

import com.maplewood.application.student.dto.CreditsDTO;
import com.maplewood.application.student.dto.OptionsDTO;
import com.maplewood.application.student.dto.SemesterSummaryDTO;
import com.maplewood.application.student.dto.StudentProfileDTO;
import com.maplewood.application.student.dto.StudentProfileResponseDTO;
import com.maplewood.domain.coursehistory.port.CourseHistoryRepositoryPort;
import com.maplewood.domain.semester.model.Semester;
import com.maplewood.domain.semester.port.SemesterRepositoryPort;
import com.maplewood.domain.student.exception.StudentNotFoundException;
import com.maplewood.domain.student.model.StudentAcademicMetrics;
import com.maplewood.domain.student.model.Student;
import com.maplewood.domain.student.port.StudentRepositoryPort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class GetMyProfileUseCase {

    private static final Integer CREDITS_MAX = 30;
    private static final Integer MAX_COURSES_PER_SEMESTER = 5;

    private final StudentRepositoryPort studentRepositoryPort;
    private final CourseHistoryRepositoryPort courseHistoryRepositoryPort;
    private final SemesterRepositoryPort semesterRepositoryPort;

    public GetMyProfileUseCase(
            StudentRepositoryPort studentRepositoryPort,
            CourseHistoryRepositoryPort courseHistoryRepositoryPort,
            SemesterRepositoryPort semesterRepositoryPort
    ) {
        this.studentRepositoryPort = studentRepositoryPort;
        this.courseHistoryRepositoryPort = courseHistoryRepositoryPort;
        this.semesterRepositoryPort = semesterRepositoryPort;
    }

    @Transactional(readOnly = true)
    public StudentProfileResponseDTO execute(Integer studentId) {
        Student student = studentRepositoryPort.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("id: " + studentId));
        StudentAcademicMetrics studentAcademicMetrics = courseHistoryRepositoryPort.findStudentAcademicMetrics(studentId);
        SemesterSummaryDTO activeSemester = semesterRepositoryPort.findActiveSemester()
                .map(this::toSemesterSummary)
                .orElse(null);

        StudentProfileDTO profile = new StudentProfileDTO(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getGradeLevel(),
                student.getEmail(),
                studentAcademicMetrics.getGpa(),
                new CreditsDTO(studentAcademicMetrics.getCreditsEarned(), CREDITS_MAX),
                new OptionsDTO(MAX_COURSES_PER_SEMESTER),
                activeSemester
        );

        return new StudentProfileResponseDTO(profile);
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
