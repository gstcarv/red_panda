import * as enrollmentsApi from '@/api/enrollments-api';
import type { Course, CourseSection } from '@/types/course.type';
import type { Enrollment } from '@/types/enrollments.type';
import { buildEnrollmentsQueryKey } from '@/hooks/enrollments/use-enrollments';
import { useUnenroll } from '@/hooks/enrollments/use-unenroll';
import { buildStudentQueryKey } from '@/hooks/students/use-student';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return {
    queryClient,
    wrapper,
  };
}

describe('useUnenroll', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls unenroll endpoint with enrollment id', async () => {
    const { wrapper } = createWrapper();
    const unenrollSpy = vi
      .spyOn(enrollmentsApi, 'unenroll')
      .mockResolvedValue({ data: {} } as never);

    const { result } = renderHook(() => useUnenroll(), {
      wrapper,
    });

    await result.current.mutateAsync('enroll-1');

    expect(unenrollSpy).toHaveBeenCalledWith('enroll-1');
  });

  it('forwards lifecycle callbacks passed from UI', async () => {
    const { wrapper } = createWrapper();
    const onMutate = mockFn<(enrollmentId: string) => void>();
    const onSuccess = mockFn<() => void>();
    const onError = mockFn<(error: unknown) => void>();
    const onSettled = mockFn<() => void>();

    vi.spyOn(enrollmentsApi, 'unenroll').mockResolvedValue({
      data: {} as never,
    } as never);

    const { result } = renderHook(
      () =>
        useUnenroll({
          onMutate,
          onSuccess,
          onError,
          onSettled,
        }),
      {
        wrapper,
      },
    );

    await result.current.mutateAsync('enroll-1');

    expect(onMutate).toHaveBeenCalledTimes(1);
    expect(onMutate.mock.calls[0][0]).toBe('enroll-1');
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it('updates enrollments cache after successful unenrollment', async () => {
    const { queryClient, wrapper } = createWrapper();
    const course: Course = {
      id: 10,
      code: 'CS-10',
      name: 'Computer Science',
      credits: 4,
      hoursPerWeek: 5,
      gradeLevel: { min: 9, max: 12 },
      availableSections: [],
    };
    const section: CourseSection = {
      id: 200,
      teacher: { id: 1, name: 'Prof. Lin' },
      meetingTimes: [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00' },
      ],
      capacity: 30,
      enrolledCount: 10,
    };
    const enrollmentOne: Enrollment = {
      id: 'e-1',
      course,
      courseSection: {
        ...section,
        id: 111,
      },
      semester: {
        id: 2,
        name: 'Spring',
        year: 2025,
        order_in_year: 2,
      },
    };
    const enrollmentTwo: Enrollment = {
      id: 'e-2',
      course,
      courseSection: section,
      semester: {
        id: 2,
        name: 'Spring',
        year: 2025,
        order_in_year: 2,
      },
    };

    queryClient.setQueryData(buildEnrollmentsQueryKey(), {
      data: { enrollments: [enrollmentOne, enrollmentTwo] },
    });

    vi.spyOn(enrollmentsApi, 'unenroll').mockResolvedValue({
      data: { enrollment: enrollmentOne },
    } as never);

    const { result } = renderHook(() => useUnenroll(), {
      wrapper,
    });

    await result.current.mutateAsync('e-1');

    const cacheData = queryClient.getQueryData<{
      data: { enrollments: Enrollment[] };
    }>(buildEnrollmentsQueryKey());

    expect(cacheData?.data.enrollments).toHaveLength(1);
    expect(cacheData?.data.enrollments[0].id).toBe('e-2');
  });

  it('invalidates student profile query after successful unenrollment', async () => {
    const { queryClient, wrapper } = createWrapper();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    vi.spyOn(enrollmentsApi, 'unenroll').mockResolvedValue({
      data: {},
    } as never);

    const { result } = renderHook(() => useUnenroll(), {
      wrapper,
    });

    await result.current.mutateAsync('enroll-1');

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: buildStudentQueryKey(),
      }),
    );
  });
});
