package com.maplewood.application.student.usecase;

import com.maplewood.application.student.dto.CreditsDTO;
import com.maplewood.application.student.dto.OptionsDTO;
import com.maplewood.application.student.dto.StudentProfileDTO;
import com.maplewood.application.student.dto.StudentProfileResponseDTO;
import com.maplewood.domain.student.exception.StudentNotFoundException;
import com.maplewood.domain.student.model.Student;
import com.maplewood.domain.student.port.StudentRepositoryPort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class GetMyProfileUseCase {

    private static final Integer CREDITS_EARNED = 0;
    private static final Integer CREDITS_MAX = 30;
    private static final Integer MAX_COURSES_PER_SEMESTER = 5;
    private static final Double GPA_PLACEHOLDER = 0.0;

    private final StudentRepositoryPort studentRepositoryPort;

    public GetMyProfileUseCase(StudentRepositoryPort studentRepositoryPort) {
        this.studentRepositoryPort = studentRepositoryPort;
    }

    @Transactional(readOnly = true)
    public StudentProfileResponseDTO execute(Integer studentId) {
        Student student = studentRepositoryPort.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("id: " + studentId));

        StudentProfileDTO profile = new StudentProfileDTO(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getGradeLevel(),
                student.getEmail(),
                GPA_PLACEHOLDER,
                new CreditsDTO(CREDITS_EARNED, CREDITS_MAX),
                new OptionsDTO(MAX_COURSES_PER_SEMESTER)
        );

        return new StudentProfileResponseDTO(profile);
    }
}
