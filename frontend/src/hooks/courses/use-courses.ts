import { getCourses } from "@/api/courses-api";
import { useQuery } from "@tanstack/react-query";
import { coursesCache } from '@/helpers/cache/courses-cache';

export function useCourses() {
    return useQuery({
        queryKey: coursesCache.buildKey(),
        queryFn: getCourses,
    });
}