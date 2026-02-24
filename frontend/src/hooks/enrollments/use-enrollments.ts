import { useQuery } from '@tanstack/react-query';
import { getStudentEnrollments } from '@/queries/enrollments/query';

export function useEnrollments() {
  return useQuery(getStudentEnrollments);
}
