package com.maplewood.application.student.dto;

import jakarta.validation.constraints.NotNull;

public record CreateEnrollmentRequestDTO(
        @NotNull(message = "courseId is required")
        Integer courseId,

        @NotNull(message = "sectionId is required")
        Integer sectionId
) {
}
