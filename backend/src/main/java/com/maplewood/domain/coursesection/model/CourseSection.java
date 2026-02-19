package com.maplewood.domain.coursesection.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

/**
 * CourseSection domain entity representing a specific section of a course
 * offered in a semester with a teacher, meeting times, and capacity.
 * 
 * A CourseSection is an instance of a Course (catalog entry) for a specific semester.
 * Multiple sections of the same course can exist in the same semester.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseSection {

    private Integer id;

    /**
     * Reference to the Course (catalog entry) this section belongs to
     */
    private Integer courseId;

    /**
     * Reference to the Semester this section is offered in
     */
    private Integer semesterId;

    /**
     * Reference to the Teacher assigned to this section
     */
    private Integer teacherId;

    /**
     * Reference to the Classroom assigned to this section
     */
    private Integer classroomId;

    /**
     * Maximum number of students that can enroll in this section
     */
    private Integer capacity;

    /**
     * Current number of enrolled students
     */
    private Integer enrolledCount;

    /**
     * Meeting times for this section (day of week, start time, end time)
     */
    private List<MeetingTime> meetingTimes;

    /**
     * Value object representing a meeting time
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MeetingTime {
        private DayOfWeek dayOfWeek;
        private String startTime;  // e.g., "09:00"
        private String endTime;    // e.g., "10:00"
    }
}
