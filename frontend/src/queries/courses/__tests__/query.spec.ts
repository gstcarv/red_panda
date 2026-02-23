import * as coursesApi from '@/api/courses-api';
import * as studentsApi from '@/api/students-api';
import {
  getCourseByIdQuery,
  getCoursesQuery,
  getStudentCourseHistoryQuery,
} from '@/queries/courses/query';
import { describe, expect, it, vi } from 'vitest';

describe('courses query options', () => {
  it('builds stable courses query options', async () => {
    const coursesSpy = vi.spyOn(coursesApi, 'getCourses').mockResolvedValue({ courses: [] } as never);

    expect(getCoursesQuery.queryKey).toEqual(['courses']);
    await getCoursesQuery.queryFn!({} as never);

    expect(coursesSpy).toHaveBeenCalledTimes(1);
  });

  it('builds course by id query options without semester', async () => {
    const courseByIdSpy = vi.spyOn(coursesApi, 'getCourseById').mockResolvedValue({} as never);
    const options = getCourseByIdQuery(10);

    expect(options.queryKey).toEqual(['course', 10, null]);
    expect(options.enabled).toBe(true);
    await options.queryFn!({} as never);

    expect(courseByIdSpy).toHaveBeenCalledWith(10);
  });

  it('builds course by id query options with semester', async () => {
    const courseByIdSpy = vi.spyOn(coursesApi, 'getCourseById').mockResolvedValue({} as never);
    const options = getCourseByIdQuery(10, 2);

    expect(options.queryKey).toEqual(['course', 10, 2]);
    await options.queryFn!({} as never);

    expect(courseByIdSpy).toHaveBeenCalledWith(10, 2);
  });

  it('builds stable course history query options', async () => {
    const historySpy = vi
      .spyOn(studentsApi, 'getStudentCourseHistory')
      .mockResolvedValue({ courseHistory: [] } as never);

    expect(getStudentCourseHistoryQuery.queryKey).toEqual(['me', 'courses', 'history']);
    await getStudentCourseHistoryQuery.queryFn!({} as never);

    expect(historySpy).toHaveBeenCalledTimes(1);
  });
});
