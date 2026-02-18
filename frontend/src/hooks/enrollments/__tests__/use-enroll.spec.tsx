import * as enrollmentsApi from '@/api/enrollments-api';
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

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useEnroll', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends enrollment payload with selected course id', async () => {
    const enrollSpy = vi
      .spyOn(enrollmentsApi, 'enroll')
      .mockResolvedValue({ data: { courses: [] } } as never);

    const { result } = renderHook(() => useEnroll(20), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(100);

    expect(enrollSpy).toHaveBeenCalledWith({
      studentId: 1,
      courseId: 20,
      sectionId: 100,
    });
  });

  it('triggers lifecycle callbacks passed from UI', async () => {
    const onMutate = mockFn<(sectionId: number) => void>();
    const onSuccess = mockFn<() => void>();
    const onError = mockFn<(error: unknown) => void>();
    const onSettled = mockFn<() => void>();

    vi.spyOn(enrollmentsApi, 'enroll').mockResolvedValue({
      data: { courses: [] },
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
        wrapper: createWrapper(),
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
    const enrollSpy = vi.spyOn(enrollmentsApi, 'enroll');

    const { result } = renderHook(() => useEnroll(null), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync(50)).rejects.toThrow(
      'No course selected',
    );

    expect(enrollSpy).not.toHaveBeenCalled();
  });
});
