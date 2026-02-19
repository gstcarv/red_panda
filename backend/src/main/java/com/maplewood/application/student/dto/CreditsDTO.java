package com.maplewood.application.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditsDTO {
    private Integer earned;
    private Integer max;
}
