package com.maplewood.domain.student.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Student domain entity representing a student in Maplewood High School.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    private Integer id;

    private String firstName;

    private String lastName;

    private String email;

    private Integer gradeLevel;

    private Integer enrollmentYear;

    private Integer expectedGraduationYear;

    private String status;

    private Instant createdAt;
}
