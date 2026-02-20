package com.maplewood.domain.semester.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Semester domain entity representing an academic semester
 * Pure domain model (no persistence framework annotations).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Semester {

    private Integer id;

    private String name;

    private Integer year;

    /**
     * Semester order within academic year: 1=Fall, 2=Spring
     */
    private Integer orderInYear;

    private String startDate;

    private String endDate;

    private Boolean isActive;

    private Instant createdAt;
}
