package com.maplewood.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student_enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INTEGER")
    private Integer id;

    @Column(name = "student_id", nullable = false, columnDefinition = "INTEGER")
    private Integer studentId;

    @Column(name = "course_id", nullable = false, columnDefinition = "INTEGER")
    private Integer courseId;

    @Column(name = "section_id", nullable = false, columnDefinition = "INTEGER")
    private Integer sectionId;

    @Column(name = "semester_id", nullable = false, columnDefinition = "INTEGER")
    private Integer semesterId;

    @Column(name = "created_at", columnDefinition = "DATETIME")
    private String createdAt;
}
