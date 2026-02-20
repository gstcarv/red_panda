package com.maplewood.domain.coursehistory.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseHistory {
    private Integer id;
    private Integer studentId;
    private Integer courseId;
    private Integer semesterId;
    private String status;
    private Instant createdAt;
}
