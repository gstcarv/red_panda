import { getStudentEnrollments } from "@/api/students-api";
import { useQuery } from "@tanstack/react-query";

export function buildEnrollmentsQueryKey() {
  return ["me", "enrollments"] as const;
}

export function useEnrollments() {
  return useQuery({
    queryKey: buildEnrollmentsQueryKey(),
    queryFn: getStudentEnrollments,
  });
}
