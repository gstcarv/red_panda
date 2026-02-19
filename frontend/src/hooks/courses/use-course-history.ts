import { useQuery } from "@tanstack/react-query";
import { getStudentCourseHistory } from "@/api/students-api";

export function buildCourseHistoryQueryKey() {
  return ["me", "courses", "history"] as const;
}

export function useCourseHistory() {
  return useQuery({
    queryKey: buildCourseHistoryQueryKey(),
    queryFn: getStudentCourseHistory,
  });
}
