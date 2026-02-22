import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as coursesApi from '@/api/courses-api';
import { useCourses } from '@/hooks/courses/use-courses';
import * as useFilterCoursesHook from '@/hooks/courses/use-filter-courses';

vi.mock('@/hooks/courses/use-filter-courses', () => ({
  useFilterCourses: vi.fn(),
}));

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
    vi.spyOn(useFilterCoursesHook, 'useFilterCourses').mockReturnValue({
      filteredCourses: [{ id: 1, name: 'Algebra' }],
    } as never);
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
    expect(result.current.courses).toHaveLength(1);
  });

  it('passes provided filter to useFilterCourses', async () => {
    const response = {
      data: {
        courses: [{ id: 1, name: 'Algebra' }],
      },
    };
    const useFilterCoursesSpy = vi
      .spyOn(useFilterCoursesHook, 'useFilterCourses')
      .mockReturnValue({
        filteredCourses: [],
      } as never);
    vi.spyOn(coursesApi, 'getCourses').mockResolvedValue(response as never);

    const filter = {
      search: 'alg',
      fromTime: '',
      untilTime: '',
      weekdays: [] as string[],
    };

    renderHook(() => useCourses(filter), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(useFilterCoursesSpy).toHaveBeenCalledWith({
        courses: expect.any(Array),
        filter,
      });
    });
  });
});
