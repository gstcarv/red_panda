package com.maplewood.domain.course.model;

import com.maplewood.domain.course.exception.InvalidCourseTypeException;

public enum CourseType {
    CORE("core"),
    ELECTIVE("elective");

    private final String value;

    CourseType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static CourseType fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (CourseType type : CourseType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new InvalidCourseTypeException(value);
    }
}
