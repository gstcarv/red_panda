package com.maplewood.domain.course.exception;

public class InvalidCourseTypeException extends RuntimeException {

    public InvalidCourseTypeException(String value) {
        super("Unknown courseType: " + value);
    }
}
