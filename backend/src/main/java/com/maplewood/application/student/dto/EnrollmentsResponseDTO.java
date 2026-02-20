package com.maplewood.application.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentsResponseDTO {
    private List<EnrollmentDTO> enrollments;
}
