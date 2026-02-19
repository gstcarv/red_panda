package com.maplewood.application.student.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SemesterSummaryDTO {
    private Integer id;
    private String name;
    private Integer year;

    @JsonProperty("order_in_year")
    private Integer orderInYear;
}
