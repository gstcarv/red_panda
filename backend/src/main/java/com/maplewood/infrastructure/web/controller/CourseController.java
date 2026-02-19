package com.maplewood.infrastructure.web.controller;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.application.course.dto.CoursesResponseDTO;
import com.maplewood.application.course.mapper.CourseMapper;
import com.maplewood.application.course.usecase.GetAllCoursesUseCase;
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
 * Part of Infrastructure Layer - handles HTTP requests/responses
 */
@Slf4j
@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Course management and browsing APIs")
public class CourseController {

    private final GetAllCoursesUseCase getAllCoursesUseCase;
    private final CourseMapper courseMapper;

    @Autowired
    public CourseController(GetAllCoursesUseCase getAllCoursesUseCase, CourseMapper courseMapper) {
        this.getAllCoursesUseCase = getAllCoursesUseCase;
        this.courseMapper = courseMapper;
    }

    /**
     * Get all courses
     * 
     * @return List of all courses
     */
    @Operation(summary = "Get all courses", description = "Retrieve a list of all courses")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved courses", 
                    content = @Content(schema = @Schema(implementation = CoursesResponseDTO.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<CoursesResponseDTO> getAllCourses() {
        log.info("Received request to get all courses");

        try {
            var courses = getAllCoursesUseCase.execute();
            List<CourseDTO> courseDTOs = courseMapper.toDTOList(courses);

            log.debug("Successfully retrieved {} courses", courseDTOs.size());
            CoursesResponseDTO response = new CoursesResponseDTO(courseDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error retrieving courses", e);
            throw e;
        }
    }

}
