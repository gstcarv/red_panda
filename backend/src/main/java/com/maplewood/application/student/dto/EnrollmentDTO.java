package com.maplewood.application.student.dto;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.application.coursesection.dto.CourseSectionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDTO {
    private Integer id;
    private CourseDTO course;
    private CourseSectionDTO courseSection;
    private SemesterSummaryDTO semester;
}
