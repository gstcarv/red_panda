package com.maplewood.domain.semester.exception;

/**
 * Exception thrown when there is no active semester.
 */
public class ActiveSemesterNotFoundException extends RuntimeException {

    public ActiveSemesterNotFoundException() {
        super("Active semester not found");
    }
}
