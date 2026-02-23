import {
  buildCourseByIdQueryKey,
  buildCourseHistoryQueryKey,
  buildCoursesQueryKey,
  coursesCache,
} from '@/queries/courses/cache';
import { describe, expect, it } from 'vitest';

describe('courses cache', () => {
  it('builds a stable courses query key', () => {
    expect(buildCoursesQueryKey()).toEqual(['courses']);
    expect(coursesCache.buildCoursesQueryKey()).toEqual(['courses']);
  });

  it('builds a stable course history query key', () => {
    expect(buildCourseHistoryQueryKey()).toEqual(['me', 'courses', 'history']);
    expect(coursesCache.buildCourseHistoryQueryKey()).toEqual(['me', 'courses', 'history']);
  });

  it('builds a course by id query key with defaults', () => {
    expect(buildCourseByIdQueryKey(10)).toEqual(['course', 10, null]);
    expect(coursesCache.buildCourseByIdQueryKey(10)).toEqual(['course', 10, null]);
  });

  it('builds a course by id query key with semester', () => {
    expect(buildCourseByIdQueryKey(10, 2)).toEqual(['course', 10, 2]);
    expect(coursesCache.buildCourseByIdQueryKey(10, 2)).toEqual(['course', 10, 2]);
  });
});
