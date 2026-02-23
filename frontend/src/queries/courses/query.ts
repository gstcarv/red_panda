import { queryOptions } from '@tanstack/react-query';
import * as coursesApi from '@/api/courses-api';
import * as studentsApi from '@/api/students-api';
import { coursesCache } from './cache';

export const getCoursesQuery = queryOptions({
  queryKey: coursesCache.buildCoursesQueryKey(),
  queryFn: () => coursesApi.getCourses(),
});

export function getCourseByIdQuery(courseId: number | null, semesterId: number | null = null) {
  return queryOptions({
    queryKey: coursesCache.buildCourseByIdQueryKey(courseId, semesterId),
    queryFn: () =>
      semesterId === null
        ? coursesApi.getCourseById(courseId!)
        : coursesApi.getCourseById(courseId!, semesterId),
    enabled: courseId !== null,
  });
}

export const getStudentCourseHistoryQuery = queryOptions({
  queryKey: coursesCache.buildCourseHistoryQueryKey(),
  queryFn: () => studentsApi.getStudentCourseHistory(),
});
