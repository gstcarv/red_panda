package com.maplewood.domain.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAcademicMetrics {
    private Integer creditsEarned;
    private Double gpa;
}
