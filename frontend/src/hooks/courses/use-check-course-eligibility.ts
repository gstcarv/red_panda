import type { Course, CourseAvailabilityError } from "@/types/course.type";
import { useEnrollments } from "../enrollments/use-enrollments";
import type { Enrollment } from "@/types/enrollments.type";
import type { CourseHistory } from "@/types/course-history.type";
import { useCourseHistory } from "./use-course-history";

type CheckEligiblityReturn = {
    eligible: boolean
    validation?: CourseAvailabilityError[]
}

export function useCheckCourseEligibility(course: Course): CheckEligiblityReturn {
    const { data: enrollmentsResponse } = useEnrollments();
    const { data: courseHistoryResponse, isLoading: isCourseHistoryLoading } =
        useCourseHistory();

    // should not be available if user already has a course in the same time slot OK    
    // should not be available if prerequisite is not passed


    // should not be available if reached the limit of 5 courses on the semester
    // should not be available if total courses credits exceed limit of 30
    // should not be available if the grade level is not appropriate

    const errors: CourseAvailabilityError[] = []

    const enrollments = enrollmentsResponse?.data.enrollments ?? [];
    const courseHistory = courseHistoryResponse?.data.courseHistory ?? [];

    const hasTimeslotConflicts = checkForTimeslotConflict(course, enrollments)

    if (hasTimeslotConflicts.length) {
        errors.push({
            type: 'conflict',
            message: "This course conflicts with your current schedule"
        })
    }

    if (
        course.prerequisite &&
        !isCourseHistoryLoading &&
        !checkCoursePrerequisite(course, courseHistory)
    ) {
        errors.push({
            type: "prerequisite",
            message: "Missing prerequisite:",
            prerequisite: course.prerequisite,
        });
    }

    return {
        eligible: !errors.length,
        validation: errors
    };
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
    // Itera
    // get all meeting_times for the course
    // iterate all meeting_times for the course
    // for each meeting_time, remove ":" and convert to number
    // then 12:30 => 1230
    // and 1300 => 1300
    // to check overlap, we can check
    // isValid = enrollStartTime > startEnd & enrollEndTime < endTime

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