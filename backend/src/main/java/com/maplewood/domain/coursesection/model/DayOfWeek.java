package com.maplewood.domain.coursesection.model;

/**
 * Enum representing days of the week for course section meeting times
 * Part of Domain Layer
 */
public enum DayOfWeek {
    MONDAY("Monday"),
    TUESDAY("Tuesday"),
    WEDNESDAY("Wednesday"),
    THURSDAY("Thursday"),
    FRIDAY("Friday");

    private final String value;

    DayOfWeek(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    /**
     * Convert string value to DayOfWeek enum
     * @param value String representation (e.g., "Monday")
     * @return DayOfWeek enum or null if not found
     */
    public static DayOfWeek fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (DayOfWeek day : DayOfWeek.values()) {
            if (day.value.equalsIgnoreCase(value)) {
                return day;
            }
        }
        return null;
    }
}
