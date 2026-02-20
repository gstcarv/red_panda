package com.maplewood.domain.course.exception;

public class InvalidSemesterOrderException extends RuntimeException {

    public InvalidSemesterOrderException(Integer value) {
        super("Unknown semesterOrder: " + value);
    }
}
