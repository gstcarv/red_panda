package com.maplewood.application.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseHistoryResponseDTO {
    private List<CourseHistoryDTO> courseHistory;
}
