package com.maplewood.domain.enrollment.service;

import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.coursehistory.model.CourseHistory;
import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.enrollment.exception.EnrollmentEligibilityException;
import com.maplewood.domain.enrollment.model.Enrollment;
import com.maplewood.domain.semester.model.Semester;
import com.maplewood.domain.student.model.Student;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
public class EnrollmentEligibilityService {

    private static final int DEFAULT_MAX_COURSES_PER_SEMESTER = 5;
    private static final double REQUIRED_GRADUATION_CREDITS = 30.0;
    private static final String PASSED_STATUS = "passed";

    public boolean canUnroll(Enrollment enrollment, Semester activeSemester) {
        if (enrollment == null || activeSemester == null || activeSemester.getId() == null) {
            return false;
        }

        return Objects.equals(enrollment.getSemesterId(), activeSemester.getId());
    }

    public boolean canEnroll(
            Student student,
            Course course,
            CourseSection targetSection,
            Semester activeSemester,
            List<Enrollment> currentSemesterEnrollments,
            List<CourseHistory> courseHistory,
            List<CourseSection> currentEnrollmentSections,
            Integer maxCoursesPerSemester,
            Double earnedCredits
    ) {
        if (!isCurrentSemesterEnrollment(targetSection, activeSemester)) {
            throw new EnrollmentEligibilityException(
                    "other",
                    "Enrollment can only be performed in the active semester."
            );
        }

        if (hasReachedEnrollmentLimit(currentSemesterEnrollments, maxCoursesPerSemester)) {
            int maxCourses = maxCoursesPerSemester == null ? DEFAULT_MAX_COURSES_PER_SEMESTER : maxCoursesPerSemester;
            throw new EnrollmentEligibilityException(
                    "max_courses",
                    "You have reached the maximum limit of " + maxCourses + " enrollments."
            );
        }

        if (hasAlreadyPassedCourse(course, courseHistory)) {
            throw new EnrollmentEligibilityException(
                    "other",
                    "You have already passed this course."
            );
        }

        if (hasReachedGraduationCredits(earnedCredits)) {
            throw new EnrollmentEligibilityException(
                    "other",
                    "You have already reached the required graduation credits.");
        }

        if (!isStudentGradeLevelEligible(student, course)) {
            throw new EnrollmentEligibilityException(
                    "grade_level",
                    "Your grade level is not eligible for this course."
            );
        }

        if (!hasPassedPrerequisite(course, courseHistory)) {
            EnrollmentEligibilityException.CoursePrerequisite prerequisite = null;
            if (course != null && course.getPrerequisiteId() != null) {
                prerequisite = new EnrollmentEligibilityException.CoursePrerequisite(
                        course.getPrerequisiteId(),
                        null,
                        null
                );
            }
            throw new EnrollmentEligibilityException(
                    "prerequisite",
                    "Missing prerequisite for enrollment.",
                    prerequisite
            );
        }

        if (hasScheduleOverlap(targetSection, currentEnrollmentSections)) {
            throw new EnrollmentEligibilityException(
                    "conflict",
                    "This course conflicts with your current schedule."
            );
        }

        return true;
    }

    private boolean hasReachedGraduationCredits(Double earnedCredits) {
        if (earnedCredits == null) {
            return false;
        }
        return earnedCredits >= REQUIRED_GRADUATION_CREDITS;
    }

    private boolean isCurrentSemesterEnrollment(CourseSection targetSection, Semester activeSemester) {
        if (targetSection == null || targetSection.getSemesterId() == null) {
            return false;
        }
        if (activeSemester == null || activeSemester.getId() == null) {
            return false;
        }
        return Objects.equals(targetSection.getSemesterId(), activeSemester.getId());
    }

    private boolean hasReachedEnrollmentLimit(List<Enrollment> currentSemesterEnrollments, Integer maxCoursesPerSemester) {
        int enrollmentsCount = currentSemesterEnrollments == null ? 0 : currentSemesterEnrollments.size();
        int maxCourses = maxCoursesPerSemester == null ? DEFAULT_MAX_COURSES_PER_SEMESTER : maxCoursesPerSemester;
        return enrollmentsCount >= maxCourses;
    }

    private boolean hasAlreadyPassedCourse(Course course, List<CourseHistory> courseHistory) {
        if (course == null || course.getId() == null || courseHistory == null) {
            return false;
        }

        return courseHistory.stream().anyMatch(history ->
                Objects.equals(history.getCourseId(), course.getId())
                        && PASSED_STATUS.equalsIgnoreCase(history.getStatus())
        );
    }

    private boolean isStudentGradeLevelEligible(Student student, Course course) {
        if (student == null || student.getGradeLevel() == null || course == null) {
            return false;
        }

        Integer min = course.getGradeLevelMin();
        Integer max = course.getGradeLevelMax();
        Integer studentGradeLevel = student.getGradeLevel();

        if (min != null && studentGradeLevel < min) {
            return false;
        }
        if (max != null && studentGradeLevel > max) {
            return false;
        }

        return true;
    }

    private boolean hasPassedPrerequisite(Course course, List<CourseHistory> courseHistory) {
        if (course == null) {
            return false;
        }

        Integer prerequisiteId = course.getPrerequisiteId();
        if (prerequisiteId == null) {
            return true;
        }
        if (courseHistory == null) {
            return false;
        }

        return courseHistory.stream().anyMatch(history ->
                Objects.equals(history.getCourseId(), prerequisiteId)
                        && PASSED_STATUS.equalsIgnoreCase(history.getStatus())
        );
    }

    private boolean hasScheduleOverlap(CourseSection targetSection, List<CourseSection> currentEnrollmentSections) {
        if (targetSection == null || targetSection.getMeetingTimes() == null || targetSection.getMeetingTimes().isEmpty()) {
            return false;
        }
        if (currentEnrollmentSections == null || currentEnrollmentSections.isEmpty()) {
            return false;
        }

        return currentEnrollmentSections.stream()
                .filter(Objects::nonNull)
                .map(CourseSection::getMeetingTimes)
                .filter(Objects::nonNull)
                .anyMatch(enrolledMeetingTimes ->
                        targetSection.getMeetingTimes().stream()
                                .anyMatch(targetMeeting ->
                                        enrolledMeetingTimes.stream()
                                                .anyMatch(enrolledMeeting -> overlaps(targetMeeting, enrolledMeeting))
                                )
                );
    }

    private boolean overlaps(CourseSection.MeetingTime first, CourseSection.MeetingTime second) {
        if (first == null || second == null) {
            return false;
        }
        if (first.getDayOfWeek() == null || second.getDayOfWeek() == null) {
            return false;
        }
        if (!Objects.equals(first.getDayOfWeek(), second.getDayOfWeek())) {
            return false;
        }

        Integer startFirst = toTimeNumber(first.getStartTime());
        Integer endFirst = toTimeNumber(first.getEndTime());
        Integer startSecond = toTimeNumber(second.getStartTime());
        Integer endSecond = toTimeNumber(second.getEndTime());

        if (startFirst == null || endFirst == null || startSecond == null || endSecond == null) {
            return false;
        }

        return startFirst < endSecond && endFirst > startSecond;
    }

    private Integer toTimeNumber(String time) {
        if (time == null || !time.contains(":")) {
            return null;
        }
        String normalizedTime = time.replace(":", "");
        try {
            return Integer.parseInt(normalizedTime);
        } catch (NumberFormatException exception) {
            return null;
        }
    }
}
