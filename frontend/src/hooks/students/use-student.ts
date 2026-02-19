import { useQuery } from "@tanstack/react-query";
import { getStudentProfile } from "@/api/students-api";

export function buildStudentQueryKey() {
  return ["me", "profile"] as const;
}

export function useStudent() {
  return useQuery({
    queryKey: buildStudentQueryKey(),
    queryFn: getStudentProfile,
  });
}

