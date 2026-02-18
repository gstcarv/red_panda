import type { CourseHistory } from "@/types/course-history.type";
import type { Course, CourseAvailabilityError } from "@/types/course.type";
import type { Enrollment } from "@/types/enrollments.type";
import type { Student } from "@/types/student.type";
import { useEnrollments } from "../enrollments/use-enrollments";
import { useCourseHistory } from "./use-course-history";
import { useStudent } from "../students/use-student";
import { useCallback } from "react";

type CheckEligiblityReturn = {
    eligible: boolean
    validation?: CourseAvailabilityError[]
}

type UseCheckCourseEligibilityReturn = {
    evaluate: (course: Course) => CheckEligiblityReturn;
}

export function evaluateCourseEligibility({
    course,
    enrollments,
    courseHistory,
    student,
    isCourseHistoryLoading,
}: {
    course: Course;
    enrollments: Enrollment[];
    courseHistory: CourseHistory[];
    student?: Student;
    isCourseHistoryLoading: boolean;
}): CheckEligiblityReturn {
    // Check in priority order: max_courses -> grade_level -> prereq -> time -> others
    // Return only the first error found (highest priority)

    // 1. max_courses
    const enrollmentLimitError = checkEnrollmentLimit(enrollments);
    if (enrollmentLimitError) {
        return {
            eligible: false,
            validation: [enrollmentLimitError]
        };
    }

    // 2. grade_level
    const gradeLevelError = checkGradeLevelEligibility(course, student);
    if (gradeLevelError) {
        return {
            eligible: false,
            validation: [gradeLevelError]
        };
    }

    // 3. prereq
    if (
        course.prerequisite &&
        !isCourseHistoryLoading &&
        !checkCoursePrerequisite(course, courseHistory)
    ) {
        return {
            eligible: false,
            validation: [{
                type: "prerequisite",
                message: "Missing prerequisite:",
                prerequisite: course.prerequisite,
            }]
        };
    }

    // 4. time (conflict)
    const hasTimeslotConflicts = checkForTimeslotConflict(course, enrollments);
    if (hasTimeslotConflicts.length) {
        return {
            eligible: false,
            validation: [{
                type: 'conflict',
                message: "This course conflicts with your current schedule"
            }]
        };
    }

    return {
        eligible: true
    };
}

export function useCheckCourseEligibility(): UseCheckCourseEligibilityReturn {
    const { data: enrollmentsResponse } = useEnrollments();
    const { data: courseHistoryResponse, isLoading: isCourseHistoryLoading } =
        useCourseHistory();
    const { data: studentResponse } = useStudent();

    const enrollments = enrollmentsResponse?.data.enrollments ?? [];
    const courseHistory = courseHistoryResponse?.data.courseHistory ?? [];
    const student = studentResponse?.data.student;

    const evaluate = useCallback((course: Course) => {
        return evaluateCourseEligibility({
            course,
            enrollments,
            courseHistory,
            student,
            isCourseHistoryLoading,
        });
    }, [courseHistory, enrollments, isCourseHistoryLoading, student]);

    return {
        evaluate,
    };
}

function checkEnrollmentLimit(
    enrollments: Enrollment[]
): CourseAvailabilityError | null {
    if (enrollments.length >= 5) {
        return {
            type: 'max_courses',
            message: "You have reached the maximum limit of 5 enrollments"
        };
    }
    return null;
}

function checkGradeLevelEligibility(
    course: Course,
    student: Student | undefined
): CourseAvailabilityError | null {
    if (!student || !course.gradeLevel) {
        return null;
    }

    const studentGradeLevel = student.gradeLevel;
    const { min, max } = course.gradeLevel;
    
    if (studentGradeLevel < min || studentGradeLevel > max) {
        return {
            type: 'grade_level',
            message: `This course is only available for grade levels ${min}-${max}. Your current grade level is ${studentGradeLevel}.`
        };
    }

    return null;
}

function checkCoursePrerequisite(
    course: Course,
    courseHistory: CourseHistory[],
): boolean {
    const prerequisite = course.prerequisite;
    if (!prerequisite) return true;

    return courseHistory.some((history) => {
        return (
            history.courseId === prerequisite.id &&
            history.status === "passed"
        );
    });
}

function checkForTimeslotConflict(course: Course, enrollments: Enrollment[]) {

    const courseSections = course.availableSections

    function convertToNumber(time: string) {
        return Number(time.replace(":", ""))
    }


    const enrollmentConflicts = enrollments.filter(enrollment => {
        return enrollment.courseSection.meetingTimes.some((enrollmentMeeting) => {
            return courseSections.some(section => {
                return section.meetingTimes.some(courseMeeting => {
                    if (courseMeeting.dayOfWeek !== enrollmentMeeting.dayOfWeek) return false

                    const start1 = convertToNumber(enrollmentMeeting.startTime)
                    const end1 = convertToNumber(enrollmentMeeting.endTime)

                    const start2 = convertToNumber(courseMeeting.startTime)
                    const end2 = convertToNumber(courseMeeting.endTime)

                    const isOvelapping = start1 < end2 && end1 > start2

                    return isOvelapping
                })
            })

        })
    })

    return enrollmentConflicts;
}