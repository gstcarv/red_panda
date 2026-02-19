package com.maplewood.application.auth.controller;

import com.maplewood.application.auth.dto.LoginRequestDTO;
import com.maplewood.application.auth.dto.LoginResponseDTO;
import com.maplewood.application.auth.usecase.LoginUseCase;
import com.maplewood.infrastructure.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for authentication operations.
 */
@Slf4j
@RestController
@Tag(name = "Auth", description = "Authentication APIs")
public class AuthController {

    private final LoginUseCase loginUseCase;

    public AuthController(LoginUseCase loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    @Operation(summary = "Login with email", description = "Find student by email and generate a JWT valid for 10 days")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token generated successfully", content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Student not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping({"/login", "/api/login"})
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        log.info("Received login request for email: {}", request.email());
        return ResponseEntity.ok(loginUseCase.execute(request.email()));
    }
}
