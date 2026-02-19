package com.maplewood.infrastructure.persistence.converter;

import com.maplewood.domain.coursesection.model.DayOfWeek;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA AttributeConverter to convert DayOfWeek enum to/from database string values
 * Part of Infrastructure Layer
 */
@Converter(autoApply = true)
public class DayOfWeekConverter implements AttributeConverter<DayOfWeek, String> {

    @Override
    public String convertToDatabaseColumn(DayOfWeek dayOfWeek) {
        if (dayOfWeek == null) {
            return null;
        }
        return dayOfWeek.getValue();
    }

    @Override
    public DayOfWeek convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return DayOfWeek.fromValue(dbData);
    }
}
