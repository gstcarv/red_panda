package com.maplewood.domain.student.exception;

public class InvalidAuthenticatedStudentException extends RuntimeException {

    public InvalidAuthenticatedStudentException() {
        super("Unable to resolve authenticated student id");
    }
}
