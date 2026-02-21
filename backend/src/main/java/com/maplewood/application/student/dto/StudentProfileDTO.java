package com.maplewood.application.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private Integer gradeLevel;
    private String email;
    private Double gpa;
    private CreditsDTO credits;
    private OptionsDTO options;
    private SemesterSummaryDTO activeSemester;
}
