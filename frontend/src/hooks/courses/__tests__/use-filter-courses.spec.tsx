import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFilterCourses } from '@/hooks/courses/use-filter-courses';
import type { Course } from '@/types/course.type';
import { useCourseHistory } from '@/hooks/courses/use-course-history';

vi.mock('@/hooks/enrollments/use-check-enrollment-eligibility', () => ({
  useCheckEnrollmentEligibility: () => ({
    evaluate: (course: Course) => ({
      eligible: course.id !== 2,
    }),
  }),
}));

vi.mock('@/hooks/courses/use-course-history', () => ({
  useCourseHistory: vi.fn(() => ({
    data: {
      data: {
        courseHistory: [],
      },
    },
  })),
}));

function createCourse({
  id,
  code,
  name,
  dayOfWeek,
  startTime,
  endTime,
}: {
  id: number;
  code: string;
  name: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}): Course {
  return {
    id,
    code,
    name,
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [
      {
        id: id * 10,
        teacher: { id: 1, name: 'Teacher' },
        meetingTimes: [
          {
            dayOfWeek,
            startTime,
            endTime,
          },
        ],
        capacity: 30,
        enrolledCount: 10,
      },
    ],
  };
}

describe('useFilterCourses', () => {
  it('hides passed courses from explore list', () => {
    vi.mocked(useCourseHistory).mockReturnValue({
      data: {
        data: {
          courseHistory: [
            {
              id: 1,
              courseId: 2,
              courseName: 'Biology',
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
    } as never);

    const courses = [
      createCourse({
        id: 2,
        code: 'BIO101',
        name: 'Biology',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
      }),
      createCourse({
        id: 4,
        code: 'GEO101',
        name: 'Geography',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
      }),
      createCourse({
        id: 3,
        code: 'CHE101',
        name: 'Chemistry',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
      }),
    ];

    const { result } = renderHook(() =>
      useFilterCourses({
        courses,
        filter: {
          search: '',
          fromTime: '',
          untilTime: '',
          weekdays: [],
        },
      }),
    );

    expect(result.current.filteredCourses.map((course) => course.id)).toEqual([3, 4]);
  });

  it('filters by weekday/time and sorts eligible courses first', () => {
    vi.mocked(useCourseHistory).mockReturnValue({
      data: {
        data: {
          courseHistory: [],
        },
      },
    } as never);

    const courses = [
      createCourse({
        id: 1,
        code: 'ART101',
        name: 'Arts',
        dayOfWeek: 'Tuesday',
        startTime: '10:00',
        endTime: '11:00',
      }),
      createCourse({
        id: 2,
        code: 'BIO101',
        name: 'Biology',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
      }),
      createCourse({
        id: 3,
        code: 'CHE101',
        name: 'Chemistry',
        dayOfWeek: 'Monday',
        startTime: '09:30',
        endTime: '10:30',
      }),
    ];

    const { result } = renderHook(() =>
      useFilterCourses({
        courses,
        filter: {
          search: '',
          fromTime: '09:00',
          untilTime: '10:30',
          weekdays: ['monday'],
        },
      }),
    );

    expect(result.current.filteredCourses.map((course) => course.id)).toEqual([3, 2]);
  });

  it('filters by search text in name or code', () => {
    vi.mocked(useCourseHistory).mockReturnValue({
      data: {
        data: {
          courseHistory: [],
        },
      },
    } as never);

    const courses = [
      createCourse({
        id: 1,
        code: 'MATH101',
        name: 'Algebra',
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '09:00',
      }),
      createCourse({
        id: 2,
        code: 'ENG201',
        name: 'Literature',
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '09:00',
      }),
    ];

    const { result } = renderHook(() =>
      useFilterCourses({
        courses,
        filter: {
          search: 'math',
          fromTime: '',
          untilTime: '',
          weekdays: [],
        },
      }),
    );

    expect(result.current.filteredCourses).toHaveLength(1);
    expect(result.current.filteredCourses[0].id).toBe(1);
  });
});
