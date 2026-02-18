import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as coursesHook from '@/hooks/courses/use-courses';
import * as enrollmentsHook from '@/hooks/enrollments/use-enrollments';
import * as courseHistoryHook from '@/hooks/courses/use-course-history';
import * as studentHook from '@/hooks/students/use-student';
import {
  buildSlotKey,
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
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function mockEligibilityDependencies() {
    vi.spyOn(enrollmentsHook, 'useEnrollments').mockReturnValue({
      data: { data: { enrollments: [] } },
      isLoading: false,
      isError: false,
    } as never);
    vi.spyOn(courseHistoryHook, 'useCourseHistory').mockReturnValue({
      data: { data: { courseHistory: [] } },
      isLoading: false,
      isError: false,
    } as never);
    vi.spyOn(studentHook, 'useStudent').mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Alex',
            lastName: 'Johnson',
            gradeLevel: 10,
            email: 'alex@example.com',
            gpa: 3.8,
            creditsEarned: 30,
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);
  }

  it('builds slot key from weekday and time', () => {
    expect(buildSlotKey(' Monday ', '11:00')).toBe('monday|11:00');
  });

  it('maps courses by weekday and hourly slot', async () => {
    mockEligibilityDependencies();
    const useCoursesSpy = vi.spyOn(coursesHook, 'useCourses').mockReturnValue({
      data: {
        data: {
          courses: [
            {
              id: 1,
              code: 'MATH101',
              name: 'Algebra I',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 10 },
              availableSections: [
                {
                  id: 1,
                  teacher: { id: 1, name: 'Dr. Smith' },
                  meetingTimes: [
                    {
                      dayOfWeek: 'Monday',
                      startTime: '09:00',
                      endTime: '11:00',
                    },
                  ],
                  capacity: 30,
                  enrolledCount: 10,
                },
              ],
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useAvailableCoursesBySlot(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.coursesBySlot.size).toBeGreaterThan(0);
    });

    expect(useCoursesSpy).toHaveBeenCalledTimes(1);
    expect(result.current.coursesBySlot.get('monday|09:00')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          code: 'MATH101',
        }),
      ]),
    );
    expect(result.current.coursesBySlot.get('monday|10:00')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
        }),
      ]),
    );
    expect(result.current.coursesBySlot.get('monday|11:00')).toBeUndefined();
  });

  it('does not include ineligible courses in slots map', async () => {
    mockEligibilityDependencies();
    vi.spyOn(coursesHook, 'useCourses').mockReturnValue({
      data: {
        data: {
          courses: [
            {
              id: 1,
              code: 'MATH101',
              name: 'Algebra I',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 10 },
              availableSections: [
                {
                  id: 1,
                  teacher: { id: 1, name: 'Dr. Smith' },
                  meetingTimes: [
                    {
                      dayOfWeek: 'Monday',
                      startTime: '09:00',
                      endTime: '10:00',
                    },
                  ],
                  capacity: 30,
                  enrolledCount: 10,
                },
              ],
            },
            {
              id: 2,
              code: 'ADV501',
              name: 'Advanced Topic',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 12, max: 12 },
              availableSections: [
                {
                  id: 2,
                  teacher: { id: 2, name: 'Dr. Doe' },
                  meetingTimes: [
                    {
                      dayOfWeek: 'Monday',
                      startTime: '09:00',
                      endTime: '10:00',
                    },
                  ],
                  capacity: 30,
                  enrolledCount: 10,
                },
              ],
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useAvailableCoursesBySlot(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.coursesBySlot.get('monday|09:00')).toBeDefined();
    });

    expect(result.current.coursesBySlot.get('monday|09:00')).toEqual([
      expect.objectContaining({ id: 1 }),
    ]);
  });
});
