import * as studentsApi from '@/api/students-api';
import { useUnenroll } from '@/hooks/enrollments/use-unenroll';
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

  it('calls unenroll endpoint with course id', async () => {
    const { wrapper } = createWrapper();
    const unenrollSpy = vi.spyOn(studentsApi, 'unenroll').mockResolvedValue({} as never);

    const { result } = renderHook(() => useUnenroll(), {
      wrapper,
    });

    await result.current.mutateAsync(10);

    expect(unenrollSpy).toHaveBeenCalledWith(10);
  });

  it('forwards lifecycle callbacks passed from UI', async () => {
    const { wrapper } = createWrapper();
    const onMutate = mockFn<(courseId: number) => void>();
    const onSuccess = mockFn<() => void>();
    const onError = mockFn<(error: unknown) => void>();
    const onSettled = mockFn<() => void>();

    vi.spyOn(studentsApi, 'unenroll').mockResolvedValue({
      enrollment: {} as never,
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

    await result.current.mutateAsync(10);

    expect(onMutate).toHaveBeenCalledTimes(1);
    expect(onMutate.mock.calls[0][0]).toBe(10);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(onSettled).toHaveBeenCalledTimes(1);
  });
});
