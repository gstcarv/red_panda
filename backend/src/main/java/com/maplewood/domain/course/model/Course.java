package com.maplewood.domain.course.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Course domain entity representing a course in the Maplewood High School system
 * Pure domain model (no persistence framework annotations).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    private Integer id;

    private String code;

    private String name;

    private String description;

    private Double credits;

    private Integer hoursPerWeek;

    private Integer specializationId;

    private Integer prerequisiteId;

    private CourseType courseType;

    private Integer gradeLevelMin;

    private Integer gradeLevelMax;

    private SemesterOrder semesterOrder;

    private String createdAt;
}
