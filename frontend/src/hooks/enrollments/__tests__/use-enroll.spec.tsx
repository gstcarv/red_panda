import * as enrollmentsApi from '@/api/enrollments-api';
import type { Course, CourseSection } from '@/types/course.type';
import type { Enrollment } from '@/types/enrollments.type';
import { buildEnrollmentsQueryKey } from '@/hooks/enrollments/use-enrollments';
import { useEnroll } from '@/hooks/enrollments/use-enroll';
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

describe('useEnroll', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockEnrollment: Enrollment = {
    id: 'mock-enrollment',
    course: {
      id: 20,
      code: 'CS-20',
      name: 'Software Engineering',
      credits: 4,
      hoursPerWeek: 5,
      gradeLevel: { min: 9, max: 12 },
      availableSections: [],
    },
    courseSection: {
      id: 100,
      teacher: { id: 1, name: 'Prof. Mock' },
      meetingTimes: [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00' },
      ],
      capacity: 30,
      enrolledCount: 10,
    },
    semester: {
      id: 2,
      name: 'Spring',
      year: 2025,
      order_in_year: 2,
    },
  };

  it('sends enrollment payload with selected course id', async () => {
    const { wrapper } = createWrapper();
    const enrollSpy = vi
      .spyOn(enrollmentsApi, 'enroll')
      .mockResolvedValue({ data: { enrollment: mockEnrollment } } as never);

    const { result } = renderHook(() => useEnroll(20), {
      wrapper,
    });

    await result.current.mutateAsync(100);

    expect(enrollSpy).toHaveBeenCalledWith({
      studentId: 1,
      courseId: 20,
      sectionId: 100,
    });
  });

  it('triggers lifecycle callbacks passed from UI', async () => {
    const { wrapper } = createWrapper();
    const onMutate = mockFn<(sectionId: number) => void>();
    const onSuccess = mockFn<() => void>();
    const onError = mockFn<(error: unknown) => void>();
    const onSettled = mockFn<() => void>();

    vi.spyOn(enrollmentsApi, 'enroll').mockResolvedValue({
      data: { enrollment: mockEnrollment },
    } as never);

    const { result } = renderHook(
      () =>
        useEnroll(1, {
          onMutate,
          onSuccess,
          onError,
          onSettled,
        }),
      {
        wrapper,
      },
    );

    await result.current.mutateAsync(10);

    expect(onMutate).toHaveBeenCalledTimes(1);
    expect(onMutate.mock.calls[0][0]).toBe(10);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it('rejects when no course is selected', async () => {
    const { wrapper } = createWrapper();
    const enrollSpy = vi.spyOn(enrollmentsApi, 'enroll');

    const { result } = renderHook(() => useEnroll(null), {
      wrapper,
    });

    await expect(result.current.mutateAsync(50)).rejects.toThrow(
      'No course selected',
    );

    expect(enrollSpy).not.toHaveBeenCalled();
  });

  it('updates enrollments cache after successful enrollment', async () => {
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
    const initialEnrollment: Enrollment = {
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
    const returnedEnrollment: Enrollment = {
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
      data: { enrollments: [initialEnrollment] },
    });

    vi.spyOn(enrollmentsApi, 'enroll').mockResolvedValue({
      data: { enrollment: returnedEnrollment },
    } as never);

    const { result } = renderHook(() => useEnroll(10), {
      wrapper,
    });

    await result.current.mutateAsync(200);

    const cacheData = queryClient.getQueryData<{
      data: { enrollments: Enrollment[] };
    }>(buildEnrollmentsQueryKey());

    expect(cacheData?.data.enrollments).toHaveLength(2);
    expect(cacheData?.data.enrollments[1].course.id).toBe(10);
    expect(cacheData?.data.enrollments[1].courseSection.id).toBe(200);
    expect(cacheData?.data.enrollments[1].id).toBe('e-2');
  });

  it('invalidates student profile query after successful enrollment', async () => {
    const { queryClient, wrapper } = createWrapper();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    vi.spyOn(enrollmentsApi, 'enroll').mockResolvedValue({
      data: { enrollment: mockEnrollment },
    } as never);

    const { result } = renderHook(() => useEnroll(20), {
      wrapper,
    });

    await result.current.mutateAsync(100);

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: buildStudentQueryKey(),
      }),
    );
  });
});
