import { useQuery } from '@tanstack/react-query';
import {
  DEFAULT_EXPLORE_COURSES_FILTER,
  type ExploreCoursesFilterValues,
} from '@/stores/explore-courses-filter-store';
import { getCoursesQuery } from '@/queries/courses/query';
import { useFilterCourses } from './use-filter-courses';

export function useCourses(filter?: ExploreCoursesFilterValues) {
  const coursesQuery = useQuery(getCoursesQuery);
  const courses = coursesQuery.data?.courses ?? [];
  const { filteredCourses } = useFilterCourses({
    courses,
    filter: filter ?? DEFAULT_EXPLORE_COURSES_FILTER,
  });

  return {
    ...coursesQuery,
    courses: filteredCourses,
  };
}
