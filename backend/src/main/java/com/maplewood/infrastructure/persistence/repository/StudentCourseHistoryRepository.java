package com.maplewood.infrastructure.persistence.repository;

import com.maplewood.infrastructure.persistence.entity.StudentCourseHistoryJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentCourseHistoryRepository extends JpaRepository<StudentCourseHistoryJpaEntity, Integer> {

    List<StudentCourseHistoryJpaEntity> findByStudentId(Integer studentId);

    @Query(value = """
            SELECT
                COALESCE(CAST(SUM(CASE WHEN sch.status = 'passed' THEN c.credits ELSE 0 END) AS INTEGER), 0) AS creditsEarned,
                IFNULL(ROUND(
                    SUM(CASE WHEN sch.status = 'passed' THEN c.credits ELSE 0 END) / SUM(c.credits) * 4.0,
                    2
                ), 0) AS calculatedGpa
            FROM students s
            LEFT JOIN student_course_history sch ON s.id = sch.student_id
            LEFT JOIN courses c ON sch.course_id = c.id
            WHERE s.id = :studentId
            GROUP BY s.id
            """, nativeQuery = true)
    StudentAcademicMetricsProjection findStudentAcademicMetricsByStudentId(@Param("studentId") Integer studentId);
}
