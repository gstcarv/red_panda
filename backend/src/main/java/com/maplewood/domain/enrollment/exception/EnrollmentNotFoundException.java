package com.maplewood.domain.enrollment.exception;

/**
 * Exception thrown when an enrollment is not found.
 */
public class EnrollmentNotFoundException extends RuntimeException {

    public EnrollmentNotFoundException(String message) {
        super(message);
    }

    public EnrollmentNotFoundException(Integer studentId, Integer courseId, Integer semesterId) {
        super("Enrollment not found for studentId=%d, courseId=%d, semesterId=%d"
                .formatted(studentId, courseId, semesterId));
    }
}
