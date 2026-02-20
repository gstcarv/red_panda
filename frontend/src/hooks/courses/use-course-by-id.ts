import { getCourseById } from "@/api/courses-api";
import { useQuery } from "@tanstack/react-query";

export function buildCourseByIdQueryKey(courseId: number | null, semesterId: number | null = null) {
    return ["course", courseId, semesterId] as const;
}

export function useCourseById(courseId: number | null, semesterId: number | null = null) {
    return useQuery({
        queryKey: buildCourseByIdQueryKey(courseId, semesterId),
        queryFn: () => semesterId === null ? getCourseById(courseId!) : getCourseById(courseId!, semesterId),
        enabled: courseId !== null,
    });
}
