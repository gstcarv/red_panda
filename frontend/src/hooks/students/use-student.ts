import { getStudentProfile } from '@/api/students-api';
import { useQuery } from '@tanstack/react-query';
import { studentsCache } from '@/helpers/cache/students-cache';

export function useStudent() {
  return useQuery({
    queryKey: studentsCache.buildKey(),
    queryFn: getStudentProfile,
  });
}
