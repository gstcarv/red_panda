package com.maplewood.application.course.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for courses list endpoint
 * Wraps courses in an object with a "courses" property
 * Part of Application Layer
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoursesResponseDTO {
    private List<CourseDTO> courses;
}
