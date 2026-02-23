import { useQuery } from '@tanstack/react-query';
import { buildCourseHistoryQueryKey } from '@/queries/courses/cache';
import { getStudentCourseHistoryQuery } from '@/queries/courses/query';

export { buildCourseHistoryQueryKey };

export function useCourseHistory() {
  return useQuery(getStudentCourseHistoryQuery);
}
