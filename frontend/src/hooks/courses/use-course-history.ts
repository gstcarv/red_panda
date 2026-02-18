import { useQuery } from "@tanstack/react-query";
import { getCourseHistory } from "@/api/course-history-api";

export function buildCourseHistoryQueryKey() {
  return ["course-history"] as const;
}

export function useCourseHistory() {
  return useQuery({
    queryKey: buildCourseHistoryQueryKey(),
    queryFn: getCourseHistory,
  });
}
