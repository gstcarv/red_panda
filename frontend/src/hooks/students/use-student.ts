import { useQuery } from "@tanstack/react-query";
import { getStudentProfile } from "@/api/students-api";

export function buildStudentQueryKey(studentId: number) {
  return ["student", studentId, "profile"] as const;
}

export function useStudent() {
  // TODO: replace with real studentId from auth/route state
  const studentId = 1;

  return useQuery({
    queryKey: buildStudentQueryKey(studentId),
    queryFn: () => getStudentProfile(studentId),
  });
}

