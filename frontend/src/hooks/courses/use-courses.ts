import { getCourses } from "@/api/courses-api";
import { useQuery } from "@tanstack/react-query";

export function useCourses() {
    return useQuery({
        queryKey: ["courses"],
        queryFn: getCourses,
    });
}