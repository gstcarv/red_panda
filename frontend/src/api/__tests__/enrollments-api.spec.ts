import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { api } from '@/config/api';
import * as studentsApi from '@/api/students-api';

describe('students api enrollments endpoints', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('posts enrollment payload', async () => {
    const postMock = mockFn<typeof api.post>();
    postMock.mockResolvedValue({ data: {} } as never);
    vi.spyOn(api, 'post').mockImplementation(postMock);

    await studentsApi.enroll({
      courseId: 2,
      sectionId: 3,
    });

    expect(postMock).toHaveBeenCalledWith('/me/enrollments', {
      courseId: 2,
      sectionId: 3,
    });
  });

  it('deletes enrollment by course id', async () => {
    const deleteMock = mockFn<typeof api.delete>();
    deleteMock.mockResolvedValue({ data: {} } as never);
    vi.spyOn(api, 'delete').mockImplementation(deleteMock);

    await studentsApi.unenroll(2);

    expect(deleteMock).toHaveBeenCalledWith('/me/enrollments', {
      params: { courseId: 2 },
    });
  });
});
