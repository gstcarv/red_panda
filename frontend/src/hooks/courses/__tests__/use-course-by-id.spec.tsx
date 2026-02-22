import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as coursesApi from '@/api/courses-api';
import { useCourseById } from '@/hooks/courses/use-course-by-id';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useCourseById', () => {
  it('does not fetch when course id is null', () => {
    const getCourseByIdSpy = vi.spyOn(coursesApi, 'getCourseById');

    const { result } = renderHook(() => useCourseById(null), {
      wrapper: createWrapper(),
    });

    expect(getCourseByIdSpy).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches course details when a valid id is provided', async () => {
    const response = {
      id: 2,
      name: 'Physics',
    };
    const getCourseByIdSpy = vi
      .spyOn(coursesApi, 'getCourseById')
      .mockResolvedValue(response as never);

    const { result } = renderHook(() => useCourseById(2), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getCourseByIdSpy).toHaveBeenCalledWith(2);
    expect(result.current.data?.id).toBe(2);
  });
});
