import { getStudentEnrollments } from "@/api/students-api";
import { useQuery } from "@tanstack/react-query";
import { enrollmentsCache } from '@/helpers/cache/enrollment-cache';

export function useEnrollments() {
  return useQuery({
    queryKey: enrollmentsCache.buildKey(),
    queryFn: getStudentEnrollments,
  });
}
