package com.maplewood.domain.enrollment.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Enrollment domain entity representing a student's current semester enrollment.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    private Integer id;

    private Integer studentId;

    private Integer courseId;

    private Integer sectionId;

    private Integer semesterId;

    private Instant createdAt;
}
