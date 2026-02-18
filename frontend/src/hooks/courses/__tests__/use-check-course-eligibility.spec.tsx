import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCheckCourseEligibility } from "@/hooks/courses/use-check-course-eligibility";
import { useCourseHistory } from "@/hooks/courses/use-course-history";
import { useEnrollments } from "@/hooks/enrollments/use-enrollments";
import { useStudent } from "@/hooks/students/use-student";
import type { Course } from "@/types/course.type";

vi.mock("@/hooks/enrollments/use-enrollments", () => ({
  useEnrollments: vi.fn(),
}));

vi.mock("@/hooks/courses/use-course-history", () => ({
  useCourseHistory: vi.fn(),
}));

vi.mock("@/hooks/students/use-student", () => ({
  useStudent: vi.fn(),
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);
const mockedUseCourseHistory = vi.mocked(useCourseHistory);
const mockedUseStudent = vi.mocked(useStudent);

function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 3,
    code: "CS201",
    name: "Data Structures",
    credits: 4,
    hoursPerWeek: 5,
    prerequisite: {
      id: 2,
      code: "CS101",
      name: "Introduction to Programming",
    },
    gradeLevel: { min: 10, max: 12 },
    availableSections: [
      {
        id: 301,
        teacher: { id: 7, name: "Dr. Lee" },
        meetingTimes: [
          {
            dayOfWeek: "Monday",
            startTime: "09:00",
            endTime: "11:00",
          },
        ],
        capacity: 30,
        enrolledCount: 20,
      },
    ],
    ...overrides,
  };
}

describe("useCheckCourseEligibility", () => {
  it("returns max courses error when student already has five enrollments", () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [1, 2, 3, 4, 5].map((id) => ({
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
                  dayOfWeek: "Tuesday",
                  startTime: "13:00",
                  endTime: "14:00",
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
            firstName: "Jane",
            lastName: "Student",
            gradeLevel: 11,
            email: "jane@example.com",
            gpa: 3.6,
            creditsEarned: 24,
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseEligibility(createCourse()));

    expect(result.current.eligible).toBe(false);
    expect(result.current.validation).toEqual([
      expect.objectContaining({
        type: "max_courses",
      }),
    ]);
  });

  it("returns grade level error when student grade is outside course range", () => {
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
            firstName: "Alex",
            lastName: "Student",
            gradeLevel: 8,
            email: "alex@example.com",
            gpa: 3.4,
            creditsEarned: 18,
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() =>
      useCheckCourseEligibility(createCourse({ prerequisite: undefined })),
    );

    expect(result.current.eligible).toBe(false);
    expect(result.current.validation).toEqual([
      expect.objectContaining({
        type: "grade_level",
      }),
    ]);
  });

  it("returns prerequisite error when prerequisite was not passed", () => {
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
            firstName: "Jane",
            lastName: "Student",
            gradeLevel: 11,
            email: "jane@example.com",
            gpa: 3.6,
            creditsEarned: 24,
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseEligibility(createCourse()));

    expect(result.current.eligible).toBe(false);
    expect(result.current.validation).toEqual([
      expect.objectContaining({
        type: "prerequisite",
      }),
    ]);
  });

  it("returns eligible when prerequisite is passed and no conflicts exist", () => {
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
              courseName: "Introduction to Programming",
              semesterId: 1,
              status: "passed",
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
            firstName: "Jane",
            lastName: "Student",
            gradeLevel: 11,
            email: "jane@example.com",
            gpa: 3.6,
            creditsEarned: 24,
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseEligibility(createCourse()));

    expect(result.current.eligible).toBe(true);
    expect(result.current.validation).toBeUndefined();
  });

  it("returns conflict error when section time overlaps enrolled course", () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [
            {
              id: "enroll-1",
              course: createCourse({ id: 1, prerequisite: undefined }),
              courseSection: {
                id: 101,
                teacher: { id: 1, name: "Dr. Smith" },
                meetingTimes: [
                  {
                    dayOfWeek: "Monday",
                    startTime: "10:00",
                    endTime: "12:00",
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
              courseName: "Introduction to Programming",
              semesterId: 1,
              status: "passed",
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
            firstName: "Jane",
            lastName: "Student",
            gradeLevel: 11,
            email: "jane@example.com",
            gpa: 3.6,
            creditsEarned: 24,
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseEligibility(createCourse()));

    expect(result.current.eligible).toBe(false);
    expect(result.current.validation).toEqual([
      expect.objectContaining({
        type: "conflict",
      }),
    ]);
  });

  it("returns only the highest-priority validation error", () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [1, 2, 3, 4, 5].map((id) => ({
            id: `enroll-${id}`,
            course: createCourse({ id }),
            courseSection: {
              id: 100 + id,
              teacher: { id, name: `Teacher ${id}` },
              meetingTimes: [
                {
                  dayOfWeek: "Monday",
                  startTime: "09:00",
                  endTime: "11:00",
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
            firstName: "Chris",
            lastName: "Student",
            gradeLevel: 8,
            email: "chris@example.com",
            gpa: 3.1,
            creditsEarned: 16,
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useCheckCourseEligibility(createCourse()));

    expect(result.current.eligible).toBe(false);
    expect(result.current.validation).toHaveLength(1);
    expect(result.current.validation?.[0].type).toBe("max_courses");
  });
});
