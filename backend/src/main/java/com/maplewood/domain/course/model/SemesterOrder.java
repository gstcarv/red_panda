package com.maplewood.domain.course.model;

public enum SemesterOrder {
    FALL(1),
    SPRING(2);

    private final int value;

    SemesterOrder(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static SemesterOrder fromValue(Integer value) {
        if (value == null) {
            return null;
        }
        for (SemesterOrder order : SemesterOrder.values()) {
            if (order.value == value) {
                return order;
            }
        }
        throw new IllegalArgumentException("Unknown semesterOrder: " + value);
    }
}
