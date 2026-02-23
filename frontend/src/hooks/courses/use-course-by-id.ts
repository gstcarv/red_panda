import { useQuery } from '@tanstack/react-query';
import { buildCourseByIdQueryKey } from '@/queries/courses/cache';
import { getCourseByIdQuery } from '@/queries/courses/query';

export { buildCourseByIdQueryKey };

export function useCourseById(courseId: number | null, semesterId: number | null = null) {
  return useQuery(getCourseByIdQuery(courseId, semesterId));
}
