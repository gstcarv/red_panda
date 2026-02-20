package com.maplewood.domain.enrollment.exception;

public class EnrollmentEligibilityException extends RuntimeException {

    private final String type;
    private final CoursePrerequisite prerequisite;

    public EnrollmentEligibilityException(String type, String message) {
        super(message);
        this.type = type;
        this.prerequisite = null;
    }

    public EnrollmentEligibilityException(String type, String message, CoursePrerequisite prerequisite) {
        super(message);
        this.type = type;
        this.prerequisite = prerequisite;
    }

    public String getType() {
        return type;
    }

    public CoursePrerequisite getPrerequisite() {
        return prerequisite;
    }

    public static class CoursePrerequisite {
        private final Integer id;
        private final String code;
        private final String name;

        public CoursePrerequisite(Integer id, String code, String name) {
            this.id = id;
            this.code = code;
            this.name = name;
        }

        public Integer getId() {
            return id;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }
    }
}
