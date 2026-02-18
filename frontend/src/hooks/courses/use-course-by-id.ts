import { getCourseById } from "@/api/courses-api";
import { useQuery } from "@tanstack/react-query";

export function useCourseById(courseId: number | null) {
    return useQuery({
        queryKey: ["course", courseId],
        queryFn: () => getCourseById(courseId!),
        enabled: courseId !== null,
    });
}
