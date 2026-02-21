package com.maplewood.infrastructure.persistence.repository;

public interface StudentAcademicMetricsProjection {
    Integer getCreditsEarned();

    Double getCalculatedGpa();
}
