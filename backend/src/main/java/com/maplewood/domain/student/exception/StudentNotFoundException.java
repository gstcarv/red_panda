package com.maplewood.domain.student.exception;

/**
 * Exception thrown when a student is not found by email.
 */
public class StudentNotFoundException extends RuntimeException {

    public StudentNotFoundException(String email) {
        super("Student not found with email: " + email);
    }
}
