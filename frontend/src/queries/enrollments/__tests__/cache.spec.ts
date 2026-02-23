import { queryClient } from '@/lib/react-query';
import type { GetStudentEnrollmentsResponse } from '@/api/students-api';
import { buildEnrollmentQueryKey, enrollmentsCache } from '@/queries/enrollments/cache';
import type { Enrollment } from '@/types/enrollments.type';
import { afterEach, describe, expect, it, vi } from 'vitest';

function createEnrollment(id: string, courseId: number, sectionId: number): Enrollment {
  return {
    id,
    course: {
      id: courseId,
      code: `CS-${courseId}`,
      name: `Course ${courseId}`,
      credits: 4,
      hoursPerWeek: 5,
      gradeLevel: { min: 9, max: 12 },
      availableSections: [],
    },
    courseSection: {
      id: sectionId,
      teacher: { id: 1, name: 'Teacher' },
      meetingTimes: [{ dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00' }],
      capacity: 30,
      enrolledCount: 10,
    },
    semester: {
      id: 1,
      name: 'Spring',
      year: 2026,
      orderInYear: 1,
    },
  };
}

function seedEnrollmentsCache(enrollments: Enrollment[]) {
  queryClient.setQueryData<GetStudentEnrollmentsResponse>(buildEnrollmentQueryKey(), {
    enrollments,
  });
}

describe('enrollments cache', () => {
  afterEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  it('builds a stable enrollments query key', () => {
    expect(buildEnrollmentQueryKey()).toEqual(['me', 'enrollments']);
    expect(enrollmentsCache.buildEnrollmentQueryKey()).toEqual(['me', 'enrollments']);
  });

  it('adds an enrollment to cache', () => {
    const first = createEnrollment('e-1', 10, 100);
    const second = createEnrollment('e-2', 11, 101);
    seedEnrollmentsCache([first]);

    enrollmentsCache.addEnrollment({ enrollment: second });

    const cacheData = queryClient.getQueryData<GetStudentEnrollmentsResponse>(
      buildEnrollmentQueryKey(),
    );

    expect(cacheData?.enrollments).toHaveLength(2);
    expect(cacheData?.enrollments[1].id).toBe('e-2');
  });

  it('removes enrollment by course id', () => {
    const first = createEnrollment('e-1', 10, 100);
    const second = createEnrollment('e-2', 11, 101);
    seedEnrollmentsCache([first, second]);

    enrollmentsCache.removeEnrollmentByCourseId({ courseId: 10 });

    const cacheData = queryClient.getQueryData<GetStudentEnrollmentsResponse>(
      buildEnrollmentQueryKey(),
    );

    expect(cacheData?.enrollments).toHaveLength(1);
    expect(cacheData?.enrollments[0].course.id).toBe(11);
  });

  it('invalidates enrollments query key', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await enrollmentsCache.invalidate();

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: buildEnrollmentQueryKey(),
    });
  });
});
