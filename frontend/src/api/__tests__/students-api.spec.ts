import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { api } from '@/config/api';
import * as studentsApi from '@/api/students-api';

describe('students api module', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests student course history endpoint', async () => {
    const getMock = mockFn<typeof api.get>();
    getMock.mockResolvedValue({ data: { courseHistory: [] } } as never);
    vi.spyOn(api, 'get').mockImplementation(getMock);

    await studentsApi.getStudentCourseHistory();

    expect(getMock).toHaveBeenCalledWith('/me/courses/history');
  });

  it('requests student profile endpoint', async () => {
    const getMock = mockFn<typeof api.get>();
    getMock.mockResolvedValue({ data: { student: {} } } as never);
    vi.spyOn(api, 'get').mockImplementation(getMock);

    await studentsApi.getStudentProfile();

    expect(getMock).toHaveBeenCalledWith('/me/profile');
  });

  it('requests student enrollments endpoint', async () => {
    const getMock = mockFn<typeof api.get>();
    getMock.mockResolvedValue({ data: { enrollments: [] } } as never);
    vi.spyOn(api, 'get').mockImplementation(getMock);

    await studentsApi.getStudentEnrollments();

    expect(getMock).toHaveBeenCalledWith('/me/enrollments');
  });
});
