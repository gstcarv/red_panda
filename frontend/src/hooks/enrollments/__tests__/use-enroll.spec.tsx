import * as studentsApi from '@/api/students-api';
import type { Enrollment } from '@/types/enrollments.type';
import { useEnroll } from '@/hooks/enrollments/use-enroll';
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
      .spyOn(studentsApi, 'enroll')
      .mockResolvedValue({ data: { enrollment: mockEnrollment } } as never);

    const { result } = renderHook(() => useEnroll(20), {
      wrapper,
    });

    await result.current.mutateAsync(100);

    expect(enrollSpy).toHaveBeenCalledWith({
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

    vi.spyOn(studentsApi, 'enroll').mockResolvedValue({
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
    const enrollSpy = vi.spyOn(studentsApi, 'enroll');

    const { result } = renderHook(() => useEnroll(null), {
      wrapper,
    });

    await expect(result.current.mutateAsync(50)).rejects.toThrow(
      'No course selected',
    );

    expect(enrollSpy).not.toHaveBeenCalled();
  });

});
