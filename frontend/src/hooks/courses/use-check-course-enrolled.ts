import type { Course, CourseSection } from "@/types/course.type";
import { useEnrollments } from "../enrollments/use-enrollments";
import { useMemo } from "react";

type CheckCourseEnrolledReturn = {
    isEnrolled: boolean;
    enrolledSections: CourseSection[];
    isLoading: boolean;
    isError: boolean;
}

export function useCheckCourseEnrolled(course: Course): CheckCourseEnrolledReturn {
    const { data, isLoading, isError } = useEnrollments();
    const enrollments = data?.data.enrollments ?? [];
    
    const enrolledSections = useMemo(() => {
        return enrollments
            .filter((enrollment) => enrollment.course.id === course.id)
            .map((enrollment) => enrollment.courseSection);
    }, [enrollments, course.id]);

    const isEnrolled = enrolledSections.length > 0;

    return {
        isEnrolled,
        enrolledSections,
        isLoading,
        isError,
    };
}
