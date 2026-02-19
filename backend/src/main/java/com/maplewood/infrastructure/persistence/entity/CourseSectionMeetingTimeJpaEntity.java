package com.maplewood.infrastructure.persistence.entity;

import com.maplewood.domain.coursesection.model.DayOfWeek;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JPA Entity for course_section_meeting_times table
 * Part of Infrastructure Layer
 */
@Entity
@Table(name = "course_section_meeting_times")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionMeetingTimeJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INTEGER")
    private Integer id;

    @Column(name = "course_section_id", nullable = false, columnDefinition = "INTEGER")
    private Integer courseSectionId;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false, length = 5)
    private String startTime;

    @Column(name = "end_time", nullable = false, length = 5)
    private String endTime;
}
