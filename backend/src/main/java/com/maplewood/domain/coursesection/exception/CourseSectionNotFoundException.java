package com.maplewood.domain.coursesection.exception;

/**
 * Exception thrown when a course section is not found.
 */
public class CourseSectionNotFoundException extends RuntimeException {

    public CourseSectionNotFoundException(Integer sectionId) {
        super("Course section not found for sectionId: " + sectionId);
    }
}
