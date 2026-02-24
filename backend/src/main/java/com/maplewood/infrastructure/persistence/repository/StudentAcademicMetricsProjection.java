package com.maplewood.infrastructure.persistence.repository;

import java.math.BigDecimal;

public interface StudentAcademicMetricsProjection {
    BigDecimal getCreditsEarned();

    Double getCalculatedGpa();
}
