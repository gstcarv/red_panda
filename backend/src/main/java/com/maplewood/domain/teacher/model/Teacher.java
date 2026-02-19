package com.maplewood.domain.teacher.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Teacher domain entity representing a teacher in the Maplewood High School system
 * Pure domain model (no persistence framework annotations).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {

    private Integer id;

    private String firstName;

    private String lastName;

    private Integer specializationId;

    private String email;

    private Integer maxDailyHours;

    private String createdAt;

    /**
     * Get full name of the teacher
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
