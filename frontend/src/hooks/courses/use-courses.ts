import { getCourses } from "@/api/courses-api";
import { useQuery } from "@tanstack/react-query";
import { coursesCache } from '@/helpers/cache/courses-cache';
import {
  DEFAULT_EXPLORE_COURSES_FILTER,
  type ExploreCoursesFilterValues,
} from '@/stores/explore-courses-filter-store';
import { useFilterCourses } from './use-filter-courses';

export function useCourses(filter?: ExploreCoursesFilterValues) {
  const coursesQuery = useQuery({
    queryKey: coursesCache.buildKey(),
    queryFn: getCourses,
  });
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