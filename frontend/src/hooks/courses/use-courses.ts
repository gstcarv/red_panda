import { getCourses } from "@/api/courses-api";
import { useQuery } from "@tanstack/react-query";

export function buildCoursesQueryKey() {
    return ["courses"] as const;
}

export function useCourses() {
    return useQuery({
        queryKey: buildCoursesQueryKey(),
        queryFn: getCourses,
    });
}