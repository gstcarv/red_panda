import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as coursesApi from '@/api/courses-api';
import { useCourses } from '@/hooks/courses/use-courses';

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

describe('useCourses', () => {
  it('loads and exposes the courses response', async () => {
    const response = {
      data: {
        courses: [{ id: 1, name: 'Algebra' }],
      },
    };
    const getCoursesSpy = vi
      .spyOn(coursesApi, 'getCourses')
      .mockResolvedValue(response as never);

    const { result } = renderHook(() => useCourses(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getCoursesSpy).toHaveBeenCalledTimes(1);
    expect(result.current.data?.data.courses).toHaveLength(1);
  });
});
