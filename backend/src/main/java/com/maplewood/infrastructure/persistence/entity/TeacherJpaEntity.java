package com.maplewood.infrastructure.persistence.entity;

import java.time.Instant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JPA Entity for teachers table
 * Part of Infrastructure Layer
 */
@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INTEGER")
    private Integer id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "specialization_id", nullable = false, columnDefinition = "INTEGER")
    private Integer specializationId;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "max_daily_hours")
    private Integer maxDailyHours;

    @Column(name = "created_at", columnDefinition = "DATETIME")
    private Instant createdAt;
}
