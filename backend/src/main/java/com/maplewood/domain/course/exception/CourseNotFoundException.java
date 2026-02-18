package com.maplewood.domain.course.exception;

/**
 * Exception thrown when a course is not found
 */
public class CourseNotFoundException extends RuntimeException {
    
    public CourseNotFoundException(String message) {
        super(message);
    }
    
    public CourseNotFoundException(Integer courseId) {
        super("Course not found with id: " + courseId);
    }
}
