import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useSchedulerEnrollments } from '@/hooks/enrollments/use-scheduler-enrollments';

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);

describe('useSchedulerEnrollments', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('maps enrollments into scheduler events', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [
            {
              id: 'enroll-1',
              course: {
                id: 1,
                code: 'MATH101',
                name: 'Algebra I',
              },
              courseSection: {
                id: 100,
                meetingTimes: [
                  {
                    dayOfWeek: 'Monday',
                    startTime: '09:00',
                    endTime: '10:00',
                  },
                  {
                    dayOfWeek: 'Wednesday',
                    startTime: '09:00',
                    endTime: '10:00',
                  },
                ],
              },
            },
          ],
        },
      },
    } as never);

    const { result } = renderHook(() => useSchedulerEnrollments());

    expect(result.current.events).toEqual([
      {
        id: 'enroll-1-100-1-09:00',
        title: 'MATH101 - Algebra I',
        daysOfWeek: [1],
        startTime: '09:00',
        endTime: '10:00',
      },
      {
        id: 'enroll-1-100-3-09:00',
        title: 'MATH101 - Algebra I',
        daysOfWeek: [3],
        startTime: '09:00',
        endTime: '10:00',
      },
    ]);
  });

  it('ignores meeting times with invalid day names', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [
            {
              id: 'enroll-2',
              course: {
                id: 2,
                code: 'CHEM101',
                name: 'Chemistry',
              },
              courseSection: {
                id: 101,
                meetingTimes: [
                  {
                    dayOfWeek: 'InvalidDay',
                    startTime: '11:00',
                    endTime: '12:00',
                  },
                ],
              },
            },
          ],
        },
      },
    } as never);

    const { result } = renderHook(() => useSchedulerEnrollments());
    expect(result.current.events).toEqual([]);
  });
});
