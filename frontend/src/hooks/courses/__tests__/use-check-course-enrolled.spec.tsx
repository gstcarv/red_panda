import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCheckCourseEnrolled } from '@/hooks/courses/use-check-course-enrolled';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import type { Course } from '@/types/course.type';

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);

function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 1,
    code: 'CS101',
    name: 'Intro to Programming',
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
    ...overrides,
  };
}

describe('useCheckCourseEnrolled', () => {
  it('returns enrolled sections for the selected course', () => {
    const section = {
      id: 11,
      teacher: { id: 2, name: 'Dr. Kim' },
      meetingTimes: [],
      capacity: 30,
      enrolledCount: 20,
    };

    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [
            {
              id: 'e-1',
              course: createCourse({ id: 1 }),
              courseSection: section,
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseEnrolled(createCourse({ id: 1 })));

    expect(result.current.isEnrolled).toBe(true);
    expect(result.current.enrolledSections).toEqual([section]);
  });

  it('returns not enrolled when no matching enrollment exists', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseEnrolled(createCourse({ id: 99 })));

    expect(result.current.isEnrolled).toBe(false);
    expect(result.current.enrolledSections).toEqual([]);
  });
});
