package com.maplewood.infrastructure.exception;

import com.maplewood.domain.course.exception.CourseNotFoundException;
import com.maplewood.domain.course.exception.InvalidCourseTypeException;
import com.maplewood.domain.course.exception.InvalidSemesterOrderException;
import com.maplewood.domain.coursesection.exception.CourseSectionNotFoundException;
import com.maplewood.domain.enrollment.exception.EnrollmentEligibilityException;
import com.maplewood.domain.enrollment.exception.EnrollmentNotFoundException;
import com.maplewood.domain.semester.exception.ActiveSemesterNotFoundException;
import com.maplewood.domain.semester.exception.SemesterNotFoundException;
import com.maplewood.domain.student.exception.InvalidAuthenticatedStudentException;
import com.maplewood.domain.student.exception.StudentNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

/**
 * Global exception handler for all controllers
 * Handles exceptions and returns standardized error responses
 * Part of Infrastructure Layer
 */
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle CourseNotFoundException
     */
    @ExceptionHandler(CourseNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCourseNotFoundException(
            CourseNotFoundException ex, WebRequest request) {
        
        log.warn("Course not found: {}", ex.getMessage());
        
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Course Not Found",
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        log.warn("Validation error: {}", ex.getMessage());
        
        StringBuilder errorMessage = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errorMessage.append(error.getField())
                    .append(": ")
                    .append(error.getDefaultMessage())
                    .append("; ");
        });
        
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                errorMessage.toString(),
                request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle StudentNotFoundException
     */
    @ExceptionHandler(StudentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleStudentNotFoundException(
            StudentNotFoundException ex, WebRequest request) {

        log.warn("Student not found: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Student Not Found",
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle EnrollmentNotFoundException
     */
    @ExceptionHandler(EnrollmentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEnrollmentNotFoundException(
            EnrollmentNotFoundException ex, WebRequest request) {

        log.warn("Enrollment not found: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Enrollment Not Found",
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle EnrollmentEligibilityException
     */
    @ExceptionHandler(EnrollmentEligibilityException.class)
    public ResponseEntity<ErrorResponse> handleEnrollmentEligibilityException(
            EnrollmentEligibilityException ex, WebRequest request) {

        log.warn("Enrollment eligibility failed [{}]: {}", ex.getType(), ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Enrollment Not Eligible",
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle ActiveSemesterNotFoundException
     */
    @ExceptionHandler(ActiveSemesterNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleActiveSemesterNotFoundException(
            ActiveSemesterNotFoundException ex, WebRequest request) {

        log.warn("Active semester not found: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Active Semester Not Found",
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle SemesterNotFoundException
     */
    @ExceptionHandler(SemesterNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleSemesterNotFoundException(
            SemesterNotFoundException ex, WebRequest request) {

        log.warn("Semester not found: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Semester Not Found",
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle CourseSectionNotFoundException
     */
    @ExceptionHandler(CourseSectionNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCourseSectionNotFoundException(
            CourseSectionNotFoundException ex, WebRequest request) {

        log.warn("Course section not found: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Course Section Not Found",
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        
        log.warn("Illegal argument: {}", ex.getMessage());
        
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Invalid Argument",
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
            InvalidCourseTypeException.class,
            InvalidSemesterOrderException.class,
            InvalidAuthenticatedStudentException.class
    })
    public ResponseEntity<ErrorResponse> handleInvalidRequestDomainExceptions(
            RuntimeException ex, WebRequest request) {

        log.warn("Invalid request: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Invalid Request",
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle all other exceptions (generic handler)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {
        
        log.error("Unexpected error occurred", ex);
        
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "An unexpected error occurred. Please try again later.",
                request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
