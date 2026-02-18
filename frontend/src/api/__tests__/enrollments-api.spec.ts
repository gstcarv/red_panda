import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { api } from '@/config/api';
import * as enrollmentsApi from '@/api/enrollments-api';

describe('enrollments api module', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests enrollments collection endpoint', async () => {
    const getMock = mockFn<typeof api.get>();
    getMock.mockResolvedValue({ data: { enrollments: [] } } as never);
    vi.spyOn(api, 'get').mockImplementation(getMock);

    await enrollmentsApi.getEnrollments();

    expect(getMock).toHaveBeenCalledWith('/enrollments');
  });

  it('posts enrollment payload', async () => {
    const postMock = mockFn<typeof api.post>();
    postMock.mockResolvedValue({ data: {} } as never);
    vi.spyOn(api, 'post').mockImplementation(postMock);

    await enrollmentsApi.enroll({
      studentId: 1,
      courseId: 2,
      sectionId: 3,
    });

    expect(postMock).toHaveBeenCalledWith('/enrollments', {
      studentId: 1,
      courseId: 2,
      sectionId: 3,
    });
  });

  it('deletes enrollment by id', async () => {
    const deleteMock = mockFn<typeof api.delete>();
    deleteMock.mockResolvedValue({ data: {} } as never);
    vi.spyOn(api, 'delete').mockImplementation(deleteMock);

    await enrollmentsApi.unenroll('enroll-123');

    expect(deleteMock).toHaveBeenCalledWith('/enrollments/enroll-123');
  });
});
