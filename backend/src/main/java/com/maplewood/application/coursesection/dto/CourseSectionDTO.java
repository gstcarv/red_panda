package com.maplewood.application.coursesection.dto;

import com.maplewood.domain.coursesection.model.DayOfWeek;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object for CourseSection
 * Used to expose course section information to the API
 * Part of Application Layer
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionDTO {
    private Integer id;
    private TeacherDTO teacher;
    private List<MeetingTimeDTO> meetingTimes;
    private Integer capacity;
    private Integer enrolledCount;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherDTO {
        private Integer id;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MeetingTimeDTO {
        private DayOfWeek dayOfWeek;
        private String startTime;
        private String endTime;
    }
}
