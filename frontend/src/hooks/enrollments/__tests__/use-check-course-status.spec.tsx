import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCheckCourseStatus } from '@/hooks/courses/use-check-course-status';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useCourseHistory } from '@/hooks/courses/use-course-history';
import type { Course } from '@/types/course.type';

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

vi.mock('@/hooks/courses/use-course-history', () => ({
  useCourseHistory: vi.fn(),
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);
const mockedUseCourseHistory = vi.mocked(useCourseHistory);

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

describe('useCheckCourseStatus', () => {
  it('returns passed status when course history includes passed (even if enrolled)', () => {
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
              semester: {
                id: 1,
                name: 'Fall',
                year: 2024,
                order_in_year: 1,
              },
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    mockedUseCourseHistory.mockReturnValue({
      data: {
        data: {
          courseHistory: [
            {
              id: 1,
              courseId: 1,
              courseName: 'Intro to Programming',
              semester: {
                id: 1,
                name: 'Fall',
                year: 2024,
                order_in_year: 1,
              },
              status: 'passed',
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseStatus(createCourse({ id: 1 })));

    expect(result.current.status).toBe('passed');
    expect(result.current.foundCourseHistory?.id).toBe(1);
    expect(result.current.enrolledSections).toEqual([section]);
  });

  it('returns passed status when not enrolled and course history indicates passed', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    mockedUseCourseHistory.mockReturnValue({
      data: {
        data: {
          courseHistory: [
            {
              id: 10,
              courseId: 99,
              courseName: 'Other course',
              semester: {
                id: 1,
                name: 'Fall',
                year: 2024,
                order_in_year: 1,
              },
              status: 'failed',
            },
            {
              id: 11,
              courseId: 1,
              courseName: 'Intro to Programming',
              semester: {
                id: 2,
                name: 'Spring',
                year: 2025,
                order_in_year: 2,
              },
              status: 'passed',
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseStatus(createCourse({ id: 1 })));

    expect(result.current.status).toBe('passed');
    expect(result.current.foundCourseHistory?.id).toBe(11);
    expect(result.current.enrolledSections).toEqual([]);
  });

  it('returns undefined status when neither enrolled nor in course history', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    mockedUseCourseHistory.mockReturnValue({
      data: {
        data: {
          courseHistory: [],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseStatus(createCourse({ id: 1 })));

    expect(result.current.status).toBeUndefined();
    expect(result.current.foundCourseHistory).toBeUndefined();
    expect(result.current.enrolledSections).toEqual([]);
  });

  it('ignores semester when determining history status', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    mockedUseCourseHistory.mockReturnValue({
      data: {
        data: {
          courseHistory: [
            {
              id: 20,
              courseId: 1,
              courseName: 'Intro to Programming',
              semester: {
                id: 2,
                name: 'Spring',
                year: 2025,
                order_in_year: 2,
              },
              status: 'passed',
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() =>
      useCheckCourseStatus(
        createCourse({
          id: 1,
          semester: {
            id: 1,
            name: 'Fall',
            year: 2024,
            order_in_year: 1,
          },
        }),
      ),
    );

    expect(result.current.status).toBe('passed');
  });

  it('uses provided semesterId to determine history status', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    mockedUseCourseHistory.mockReturnValue({
      data: {
        data: {
          courseHistory: [
            {
              id: 21,
              courseId: 1,
              courseName: 'Intro to Programming',
              semester: {
                id: 2,
                name: 'Spring',
                year: 2025,
                order_in_year: 2,
              },
              status: 'passed',
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseStatus(createCourse({ id: 1 }), 1));

    expect(result.current.status).toBeUndefined();
  });
});
