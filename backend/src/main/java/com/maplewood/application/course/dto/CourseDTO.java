package com.maplewood.application.course.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Course
 * Used to expose only necessary fields to the API
 * Part of Application Layer
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Integer id;
    private String code;
    private String name;
    private Double credits;
    private Integer hoursPerWeek;
    private GradeLevelDTO gradeLevel;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradeLevelDTO {
        private Integer min;
        private Integer max;
    }
}
