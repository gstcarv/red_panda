import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as coursesApi from '@/api/courses-api';
import {
  buildAvailableCoursesBySlotQueryKey,
  useAvailableCoursesBySlot,
} from '@/hooks/courses/use-available-courses-by-slot';

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

describe('useAvailableCoursesBySlot', () => {
  it('builds query key with slot params', () => {
    expect(
      buildAvailableCoursesBySlotQueryKey({
        weekDay: 'monday',
        startTime: '11:00',
      }),
    ).toEqual(['courses', 'available', 'monday', '11:00']);
  });

  it('builds query key with null params', () => {
    expect(buildAvailableCoursesBySlotQueryKey(null)).toEqual([
      'courses',
      'available',
      null,
      null,
    ]);
  });

  it('does not request data when params are null', () => {
    const getAvailableSpy = vi
      .spyOn(coursesApi, 'getAvailableCoursesBySlot')
      .mockResolvedValue({ data: { courses: [] } } as never);

    renderHook(() => useAvailableCoursesBySlot(null), {
      wrapper: createWrapper(),
    });

    expect(getAvailableSpy).not.toHaveBeenCalled();
  });

  it('loads available courses with slot params', async () => {
    const getAvailableSpy = vi
      .spyOn(coursesApi, 'getAvailableCoursesBySlot')
      .mockResolvedValue({
        data: {
          courses: [
            {
              id: 1,
              code: 'MATH101',
              name: 'Algebra I',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 10 },
              availableSections: [],
            },
          ],
        },
      } as never);

    const { result } = renderHook(
      () =>
        useAvailableCoursesBySlot({
          weekDay: 'monday',
          startTime: '11:00',
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getAvailableSpy).toHaveBeenCalledWith({
      weekDay: 'monday',
      startTime: '11:00',
    });
  });
});
