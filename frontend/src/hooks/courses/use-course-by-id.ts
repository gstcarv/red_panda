import { getCourseById } from "@/api/courses-api";
import { useQuery } from "@tanstack/react-query";

export function buildCourseByIdQueryKey(courseId: number | null) {
    return ["course", courseId] as const;
}

export function useCourseById(courseId: number | null) {
    return useQuery({
        queryKey: buildCourseByIdQueryKey(courseId),
        queryFn: () => getCourseById(courseId!),
        enabled: courseId !== null,
    });
}
