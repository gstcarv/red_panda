package com.maplewood.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * JPA Entity for course_sections table
 * Part of Infrastructure Layer
 */
@Entity
@Table(name = "course_sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INTEGER")
    private Integer id;

    @Column(name = "course_id", nullable = false, columnDefinition = "INTEGER")
    private Integer courseId;

    @Column(name = "semester_id", nullable = false, columnDefinition = "INTEGER")
    private Integer semesterId;

    @Column(name = "teacher_id", nullable = false, columnDefinition = "INTEGER")
    private Integer teacherId;

    @Column(name = "classroom_id", nullable = false, columnDefinition = "INTEGER")
    private Integer classroomId;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "enrolled_count", nullable = false)
    private Integer enrolledCount;

    @Column(name = "created_at", columnDefinition = "DATETIME")
    private String createdAt;

    @OneToMany(mappedBy = "courseSectionId", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<CourseSectionMeetingTimeJpaEntity> meetingTimes;
}
