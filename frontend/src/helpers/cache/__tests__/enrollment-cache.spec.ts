import { QueryClient } from '@tanstack/react-query';
import type { GetStudentEnrollmentsResponse } from '@/api/students-api';
import { enrollmentsCache } from '@/helpers/cache/enrollment-cache';
import type { Enrollment } from '@/types/enrollments.type';
import { describe, expect, it, vi } from 'vitest';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

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
      order_in_year: 1,
    },
  };
}

function seedEnrollmentsCache(queryClient: QueryClient, enrollments: Enrollment[]) {
  queryClient.setQueryData<GetStudentEnrollmentsResponse>(enrollmentsCache.buildKey(), {
    enrollments,
  });
}

describe('enrollmentsCache', () => {
  it('returns a stable enrollments query key', () => {
    expect(enrollmentsCache.buildKey()).toEqual(['me', 'enrollments']);
  });

  it('adds an enrollment to cached enrollments', () => {
    const queryClient = createQueryClient();
    const first = createEnrollment('e-1', 10, 100);
    const second = createEnrollment('e-2', 11, 101);
    seedEnrollmentsCache(queryClient, [first]);

    enrollmentsCache.addEnrollment({
      queryClient,
      enrollment: second,
    });

    const cacheData = queryClient.getQueryData<GetStudentEnrollmentsResponse>(
      enrollmentsCache.buildKey(),
    );

    expect(cacheData?.enrollments).toHaveLength(2);
    expect(cacheData?.enrollments[1].id).toBe('e-2');
  });

  it('does not add duplicate enrollment for same section', () => {
    const queryClient = createQueryClient();
    const initial = createEnrollment('e-1', 10, 100);
    const duplicateSection = createEnrollment('e-2', 10, 100);
    seedEnrollmentsCache(queryClient, [initial]);

    enrollmentsCache.addEnrollment({
      queryClient,
      enrollment: duplicateSection,
    });

    const cacheData = queryClient.getQueryData<GetStudentEnrollmentsResponse>(
      enrollmentsCache.buildKey(),
    );

    expect(cacheData?.enrollments).toHaveLength(1);
    expect(cacheData?.enrollments[0].id).toBe('e-1');
  });

  it('removes enrollment by course id', () => {
    const queryClient = createQueryClient();
    const first = createEnrollment('e-1', 10, 100);
    const second = createEnrollment('e-2', 11, 101);
    seedEnrollmentsCache(queryClient, [first, second]);

    enrollmentsCache.removeEnrollmentByCourseId({
      queryClient,
      courseId: 10,
    });

    const cacheData = queryClient.getQueryData<GetStudentEnrollmentsResponse>(
      enrollmentsCache.buildKey(),
    );

    expect(cacheData?.enrollments).toHaveLength(1);
    expect(cacheData?.enrollments[0].course.id).toBe(11);
  });

  it('invalidates enrollments query key', async () => {
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await enrollmentsCache.invalidate({ queryClient });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: enrollmentsCache.buildKey(),
    });
  });
});
