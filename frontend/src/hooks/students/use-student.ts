import { useQuery } from '@tanstack/react-query';
import { getStudentProfileQuery } from '@/queries/students/query';

export function useStudent() {
  return useQuery(getStudentProfileQuery);
}
