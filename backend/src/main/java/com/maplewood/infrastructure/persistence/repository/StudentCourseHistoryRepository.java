package com.maplewood.infrastructure.persistence.repository;

import com.maplewood.infrastructure.persistence.entity.StudentCourseHistoryJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentCourseHistoryRepository extends JpaRepository<StudentCourseHistoryJpaEntity, Integer> {

    List<StudentCourseHistoryJpaEntity> findByStudentId(Integer studentId);
}
