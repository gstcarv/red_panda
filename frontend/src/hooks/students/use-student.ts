import { getStudentProfile } from "@/api/students-api";
import { useQuery } from "@tanstack/react-query";

export function buildStudentQueryKey() {
  return ["student", "me", "profile"] as const;
}

export function useStudent() {
  return useQuery({
    queryKey: buildStudentQueryKey(),
    queryFn: getStudentProfile,
  });
}

