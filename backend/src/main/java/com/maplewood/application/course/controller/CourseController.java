package com.maplewood.application.course.controller;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.application.course.dto.CoursesResponseDTO;
import com.maplewood.application.course.usecase.GetAllCoursesUseCase;
import com.maplewood.application.course.usecase.GetCourseByIdUseCase;
import com.maplewood.infrastructure.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for course-related operations
 * Part of Application Layer - handles HTTP requests/responses
 */
@Slf4j
@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Course management and browsing APIs")
public class CourseController {

    private final GetAllCoursesUseCase getAllCoursesUseCase;
    private final GetCourseByIdUseCase getCourseByIdUseCase;

    @Autowired
    public CourseController(GetAllCoursesUseCase getAllCoursesUseCase,
            GetCourseByIdUseCase getCourseByIdUseCase) {
        this.getAllCoursesUseCase = getAllCoursesUseCase;
        this.getCourseByIdUseCase = getCourseByIdUseCase;
    }

    /**
     * Get all courses
     * 
     * @return List of all courses
     */
    @Operation(summary = "Get all courses", description = "Retrieve a list of all courses")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved courses", content = @Content(schema = @Schema(implementation = CoursesResponseDTO.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<CoursesResponseDTO> getAllCourses() {
        log.info("Received request to get all courses");

        try {
            List<CourseDTO> courseDTOs = getAllCoursesUseCase.execute();

            log.debug("Successfully retrieved {} courses", courseDTOs.size());
            CoursesResponseDTO response = new CoursesResponseDTO(courseDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error retrieving courses", e);
            throw e;
        }
    }

    /**
     * Get course by id
     * 
     * @param id Course id
     * @return Course details
     */
    @Operation(summary = "Get course by id", description = "Retrieve a specific course by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved course", content = @Content(schema = @Schema(implementation = CourseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Course not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Integer id) {
        log.info("Received request to get course with id: {}", id);

        try {
            CourseDTO courseDTO = getCourseByIdUseCase.execute(id);

            log.debug("Successfully retrieved course with id: {}", id);
            return ResponseEntity.ok(courseDTO);
        } catch (Exception e) {
            log.error("Error retrieving course with id: {}", id, e);
            throw e;
        }
    }

}
