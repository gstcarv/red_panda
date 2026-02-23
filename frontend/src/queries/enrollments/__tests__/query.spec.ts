import * as studentsApi from '@/api/students-api';
import { enrollmentsCache } from '@/queries/enrollments/cache';
import {
  enrollMutationOptions,
  getStudentEnrollments,
  unenrollMutationOptions,
} from '@/queries/enrollments/query';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('enrollments query options', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds stable student enrollments query options', async () => {
    const enrollmentsSpy = vi
      .spyOn(studentsApi, 'getStudentEnrollments')
      .mockResolvedValue({ enrollments: [] } as never);

    expect(getStudentEnrollments.queryKey).toEqual(['me', 'enrollments']);
    await getStudentEnrollments.queryFn!({} as never);

    expect(enrollmentsSpy).toHaveBeenCalledTimes(1);
  });

  it('builds enroll mutation options', async () => {
    const enrollSpy = vi.spyOn(studentsApi, 'enroll').mockResolvedValue({} as never);
    const options = enrollMutationOptions(10);

    await options.mutationFn?.(20, {} as never);

    expect(enrollSpy).toHaveBeenCalledWith({
      courseId: 10,
      sectionId: 20,
    });
  });

  it('throws when building enroll mutation without selected course', async () => {
    const options = enrollMutationOptions(null);

    await expect(options.mutationFn?.(20, {} as never)).rejects.toThrow('No course selected');
  });

  it('builds unenroll mutation options', async () => {
    const unenrollSpy = vi.spyOn(studentsApi, 'unenroll').mockResolvedValue({} as never);
    const options = unenrollMutationOptions();

    await options.mutationFn?.(10, {} as never);

    expect(unenrollSpy).toHaveBeenCalledWith(10);
  });

  it('handles enroll mutation onSuccess side effects', async () => {
    const addEnrollmentSpy = vi.spyOn(enrollmentsCache, 'addEnrollment').mockImplementation(() => {});
    const invalidateSpy = vi.spyOn(enrollmentsCache, 'invalidate').mockResolvedValue(undefined as never);
    const onSuccess = vi.fn();
    const options = enrollMutationOptions(10, { onSuccess });

    await options.onSuccess?.({ enrollment: { id: '1' } as never } as never, 20, undefined, {} as never);

    expect(addEnrollmentSpy).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('handles unenroll mutation onSuccess side effects', async () => {
    const removeEnrollmentSpy = vi
      .spyOn(enrollmentsCache, 'removeEnrollmentByCourseId')
      .mockImplementation(() => {});
    const invalidateSpy = vi.spyOn(enrollmentsCache, 'invalidate').mockResolvedValue(undefined as never);
    const onSuccess = vi.fn();
    const options = unenrollMutationOptions({ onSuccess });

    await options.onSuccess?.({ enrollment: {} as never } as never, 10, undefined, {} as never);

    expect(removeEnrollmentSpy).toHaveBeenCalledWith({
      courseId: 10,
    });
    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
