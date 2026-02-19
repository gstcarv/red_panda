package com.maplewood.application.course.dto;

import com.maplewood.application.coursesection.dto.CourseSectionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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
    private List<CourseSectionDTO> availableSections;

    public CourseDTO(Integer id, String code, String name, Double credits, Integer hoursPerWeek, GradeLevelDTO gradeLevel) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.credits = credits;
        this.hoursPerWeek = hoursPerWeek;
        this.gradeLevel = gradeLevel;
        this.availableSections = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradeLevelDTO {
        private Integer min;
        private Integer max;
    }
}
