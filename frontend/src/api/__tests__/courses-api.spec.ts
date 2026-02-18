import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { api } from '@/config/api';
import * as coursesApi from '@/api/courses-api';
import * as enrollmentsApi from '@/api/enrollments-api';

describe('courses and enrollments api modules', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests the courses collection endpoint', async () => {
    const getMock = mockFn<typeof api.get>();
    getMock.mockResolvedValue({ data: { courses: [] } } as never);
    vi.spyOn(api, 'get').mockImplementation(getMock);

    await coursesApi.getCourses();

    expect(getMock).toHaveBeenCalledWith('/courses');
  });

  it('requests course details by id', async () => {
    const getMock = mockFn<typeof api.get>();
    getMock.mockResolvedValue({ data: {} } as never);
    vi.spyOn(api, 'get').mockImplementation(getMock);

    await coursesApi.getCourseById(42);

    expect(getMock).toHaveBeenCalledWith('/courses/42');
  });

  it('keeps enrollments-api behavior aligned with courses-api', async () => {
    const getMock = mockFn<typeof api.get>();
    getMock.mockResolvedValue({ data: { courses: [] } } as never);
    vi.spyOn(api, 'get').mockImplementation(getMock);

    await enrollmentsApi.getCourses();
    await enrollmentsApi.getCourseById(7);

    expect(getMock).toHaveBeenNthCalledWith(1, '/courses');
    expect(getMock).toHaveBeenNthCalledWith(2, '/courses/7');
  });
});
