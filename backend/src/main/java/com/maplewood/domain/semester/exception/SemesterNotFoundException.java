package com.maplewood.domain.semester.exception;

public class SemesterNotFoundException extends RuntimeException {

    public SemesterNotFoundException(Integer semesterId) {
        super("Semester not found for semesterId: " + semesterId);
    }
}
