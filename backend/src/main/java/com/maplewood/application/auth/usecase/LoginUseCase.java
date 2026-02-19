package com.maplewood.application.auth.usecase;

import com.maplewood.application.auth.dto.LoginResponseDTO;
import com.maplewood.application.auth.port.TokenService;
import com.maplewood.domain.student.exception.StudentNotFoundException;
import com.maplewood.domain.student.model.Student;
import com.maplewood.domain.student.port.StudentRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use case for logging in students by email and issuing JWT token.
 */
@Slf4j
@Component
public class LoginUseCase {

    private final StudentRepositoryPort studentRepositoryPort;
    private final TokenService tokenService;
    private final long expirationMs;

    public LoginUseCase(
            StudentRepositoryPort studentRepositoryPort,
            TokenService tokenService,
            @Value("${jwt.expiration-ms:864000000}") long expirationMs) {
        this.studentRepositoryPort = studentRepositoryPort;
        this.tokenService = tokenService;
        this.expirationMs = expirationMs;
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO execute(String email) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();
        log.info("Executing login for email: {}", normalizedEmail);

        Student student = studentRepositoryPort.findByEmail(normalizedEmail)
                .orElseThrow(() -> new StudentNotFoundException(normalizedEmail));

        String token = tokenService.generateToken(student.getId(), student.getEmail());
        return new LoginResponseDTO(token, expirationMs, student.getEmail(), student.getId());
    }
}
