import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCheckEnrollmentEligibility } from '@/hooks/enrollments/use-check-enrollment-eligibility';
import { useCourseHistory } from '@/hooks/courses/use-course-history';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useStudent } from '@/hooks/students/use-student';
import type { Course } from '@/types/course.type';

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

vi.mock('@/hooks/courses/use-course-history', () => ({
  useCourseHistory: vi.fn(),
}));

vi.mock('@/hooks/students/use-student', () => ({
  useStudent: vi.fn(),
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);
const mockedUseCourseHistory = vi.mocked(useCourseHistory);
const mockedUseStudent = vi.mocked(useStudent);

function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 3,
    code: 'CS201',
    name: 'Data Structures',
    credits: 4,
    hoursPerWeek: 5,
    prerequisite: {
      id: 2,
      code: 'CS101',
      name: 'Introduction to Programming',
    },
    gradeLevel: { min: 10, max: 12 },
    availableSections: [
      {
        id: 301,
        teacher: { id: 7, name: 'Dr. Lee' },
        meetingTimes: [
          {
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '11:00',
          },
        ],
        capacity: 30,
        enrolledCount: 20,
      },
    ],
    ...overrides,
  };
}

describe('useCheckEnrollmentEligibility', () => {
  it('returns max courses error when student already has five enrollments', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [11, 12, 13, 14, 15].map((id) => ({
            id: `enroll-${id}`,
            course: createCourse({
              id,
              prerequisite: undefined,
            }),
            courseSection: {
              id: 100 + id,
              teacher: { id, name: `Teacher ${id}` },
              meetingTimes: [
                {
                  dayOfWeek: 'Tuesday',
                  startTime: '13:00',
                  endTime: '14:00',
                },
              ],
              capacity: 30,
              enrolledCount: 20,
            },
          })),
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
    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Jane',
            lastName: 'Student',
            gradeLevel: 11,
            email: 'jane@example.com',
            gpa: 3.6,
            credits: {
              earned: 24,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckEnrollmentEligibility());
    const eligibility = result.current.evaluate(createCourse());

    expect(eligibility.eligible).toBe(false);
    expect(eligibility.validation).toEqual([
      expect.objectContaining({
        type: 'max_courses',
      }),
    ]);
  });

  it('returns grade level error when student grade is outside course range', () => {
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
    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Alex',
            lastName: 'Student',
            gradeLevel: 8,
            email: 'alex@example.com',
            gpa: 3.4,
            credits: {
              earned: 18,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckEnrollmentEligibility());
    const eligibility = result.current.evaluate(createCourse({ prerequisite: undefined }));

    expect(eligibility.eligible).toBe(false);
    expect(eligibility.validation).toEqual([
      expect.objectContaining({
        type: 'grade_level',
        message:
          'This course is only available for grade levels 10-12. Your current grade level is 8.',
      }),
    ]);
  });

  it('renders a single grade number when course min and max are equal', () => {
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
    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Alex',
            lastName: 'Student',
            gradeLevel: 12,
            email: 'alex@example.com',
            gpa: 3.4,
            credits: {
              earned: 18,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckEnrollmentEligibility());
    const eligibility = result.current.evaluate(
      createCourse({
        prerequisite: undefined,
        gradeLevel: { min: 9, max: 9 },
      }),
    );

    expect(eligibility.eligible).toBe(false);
    expect(eligibility.validation).toEqual([
      expect.objectContaining({
        type: 'grade_level',
        message:
          'This course is only available for grade levels 9. Your current grade level is 12.',
      }),
    ]);
  });

  it('returns prerequisite error when prerequisite was not passed', () => {
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
    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Jane',
            lastName: 'Student',
            gradeLevel: 11,
            email: 'jane@example.com',
            gpa: 3.6,
            credits: {
              earned: 24,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckEnrollmentEligibility());
    const eligibility = result.current.evaluate(createCourse());

    expect(eligibility.eligible).toBe(false);
    expect(eligibility.validation).toEqual([
      expect.objectContaining({
        type: 'prerequisite',
      }),
    ]);
  });

  it('returns eligible when prerequisite is passed and no conflicts exist', () => {
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
              id: 1,
              courseId: 2,
              courseName: 'Introduction to Programming',
              semester: {
                id: 1,
                name: 'Fall',
                year: 2024,
                orderInYear: 1,
              },
              status: 'passed',
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);
    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Jane',
            lastName: 'Student',
            gradeLevel: 11,
            email: 'jane@example.com',
            gpa: 3.6,
            credits: {
              earned: 24,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckEnrollmentEligibility());
    const eligibility = result.current.evaluate(createCourse());

    expect(eligibility.eligible).toBe(true);
    expect(eligibility.validation).toBeUndefined();
  });

  it('returns not eligible when the course is already passed', () => {
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
              id: 99,
              courseId: 3,
              courseName: 'Data Structures',
              semester: {
                id: 1,
                name: 'Fall',
                year: 2024,
                orderInYear: 1,
              },
              status: 'passed',
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);
    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Jane',
            lastName: 'Student',
            gradeLevel: 11,
            email: 'jane@example.com',
            gpa: 3.6,
            credits: {
              earned: 24,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckEnrollmentEligibility());
    const eligibility = result.current.evaluate(createCourse({ prerequisite: undefined }));

    expect(eligibility.eligible).toBe(false);
    expect(eligibility.validation).toEqual([
      expect.objectContaining({
        type: 'other',
        message: 'You have already passed this course.',
      }),
    ]);
  });

  it('returns conflict error when section time overlaps enrolled course', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [
            {
              id: 'enroll-1',
              course: createCourse({ id: 1, prerequisite: undefined }),
              courseSection: {
                id: 101,
                teacher: { id: 1, name: 'Dr. Smith' },
                meetingTimes: [
                  {
                    dayOfWeek: 'Monday',
                    startTime: '10:00',
                    endTime: '12:00',
                  },
                ],
                capacity: 30,
                enrolledCount: 28,
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
              courseId: 2,
              courseName: 'Introduction to Programming',
              semester: {
                id: 1,
                name: 'Fall',
                year: 2024,
                orderInYear: 1,
              },
              status: 'passed',
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
    } as never);
    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Jane',
            lastName: 'Student',
            gradeLevel: 11,
            email: 'jane@example.com',
            gpa: 3.6,
            credits: {
              earned: 24,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckEnrollmentEligibility());
    const eligibility = result.current.evaluate(createCourse());

    expect(eligibility.eligible).toBe(false);
    expect(eligibility.validation).toEqual([
      expect.objectContaining({
        type: 'conflict',
      }),
    ]);
  });

  it('returns only the highest-priority validation error', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [11, 12, 13, 14, 15].map((id) => ({
            id: `enroll-${id}`,
            course: createCourse({ id }),
            courseSection: {
              id: 100 + id,
              teacher: { id, name: `Teacher ${id}` },
              meetingTimes: [
                {
                  dayOfWeek: 'Monday',
                  startTime: '09:00',
                  endTime: '11:00',
                },
              ],
              capacity: 30,
              enrolledCount: 20,
            },
          })),
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
    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Chris',
            lastName: 'Student',
            gradeLevel: 8,
            email: 'chris@example.com',
            gpa: 3.1,
            credits: {
              earned: 16,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckEnrollmentEligibility());
    const eligibility = result.current.evaluate(createCourse());

    expect(eligibility.eligible).toBe(false);
    expect(eligibility.validation).toHaveLength(1);
    expect(eligibility.validation?.[0].type).toBe('max_courses');
  });
});
