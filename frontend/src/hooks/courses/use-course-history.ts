import { useQuery } from "@tanstack/react-query";
import { getStudentCourseHistory } from "@/api/students-api";

export function buildCourseHistoryQueryKey(studentId: number) {
  return ["students", studentId, "courses", "history"] as const;
}

export function useCourseHistory() {
  // TODO: replace with real studentId from auth/route state
  const studentId = 1;
  return useQuery({
    queryKey: buildCourseHistoryQueryKey(studentId),
    queryFn: () => getStudentCourseHistory(studentId),
  });
}
