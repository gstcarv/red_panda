package com.maplewood.application.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseHistoryDTO {
    private Integer id;
    private Integer courseId;
    private String courseName;
    private SemesterSummaryDTO semester;
    private String status;
}
