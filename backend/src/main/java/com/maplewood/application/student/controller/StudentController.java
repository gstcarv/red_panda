package com.maplewood.application.student.controller;

import com.maplewood.application.student.dto.CourseHistoryResponseDTO;
import com.maplewood.application.student.dto.StudentProfileResponseDTO;
import com.maplewood.application.student.usecase.GetMyCourseHistoryUseCase;
import com.maplewood.application.student.usecase.GetMyProfileUseCase;
import com.maplewood.infrastructure.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/me")
@Tag(name = "Students", description = "Student profile APIs")
@SecurityRequirement(name = "bearerAuth")
public class StudentController {

    private final GetMyCourseHistoryUseCase getMyCourseHistoryUseCase;
    private final GetMyProfileUseCase getMyProfileUseCase;

    public StudentController(
            GetMyCourseHistoryUseCase getMyCourseHistoryUseCase,
            GetMyProfileUseCase getMyProfileUseCase) {
        this.getMyCourseHistoryUseCase = getMyCourseHistoryUseCase;
        this.getMyProfileUseCase = getMyProfileUseCase;
    }

    @Operation(
            summary = "Get current student profile",
            description = "Retrieve profile data for the authenticated student."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved student profile", content = @Content(schema = @Schema(implementation = StudentProfileResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized - missing or invalid JWT token"),
            @ApiResponse(responseCode = "404", description = "Student not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/profile")
    public ResponseEntity<StudentProfileResponseDTO> getMyProfile(Authentication authentication) {
        Integer studentId = extractStudentId(authentication);
        log.info("Received request to get profile for student id: {}", studentId);
        return ResponseEntity.ok(getMyProfileUseCase.execute(studentId));
    }

    @Operation(
            summary = "Get current student course history",
            description = "Retrieve historical course results for the authenticated student."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved student course history", content = @Content(schema = @Schema(implementation = CourseHistoryResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized - missing or invalid JWT token"),
            @ApiResponse(responseCode = "400", description = "Related course or semester data missing", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Student not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/courses/history")
    public ResponseEntity<CourseHistoryResponseDTO> getMyCourseHistory(Authentication authentication) {
        Integer studentId = extractStudentId(authentication);
        log.info("Received request to get course history for student id: {}", studentId);
        return ResponseEntity.ok(getMyCourseHistoryUseCase.execute(studentId));
    }

    private Integer extractStudentId(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof Integer id) {
            return id;
        }
        if (principal instanceof String value) {
            return Integer.parseInt(value);
        }
        throw new IllegalArgumentException("Unable to resolve authenticated student id");
    }
}
