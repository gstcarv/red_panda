import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCheckCourseEligibility } from "@/hooks/courses/use-check-course-eligibility";
import { useCourseHistory } from "@/hooks/courses/use-course-history";
import { useEnrollments } from "@/hooks/enrollments/use-enrollments";
import type { Course } from "@/types/course.type";

vi.mock("@/hooks/enrollments/use-enrollments", () => ({
  useEnrollments: vi.fn(),
}));

vi.mock("@/hooks/courses/use-course-history", () => ({
  useCourseHistory: vi.fn(),
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);
const mockedUseCourseHistory = vi.mocked(useCourseHistory);

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

    const { result } = renderHook(() => useCheckCourseEligibility(createCourse()));

    expect(result.current.eligible).toBe(false);
    expect(result.current.validation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "prerequisite",
        }),
      ]),
    );
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

    const { result } = renderHook(() => useCheckCourseEligibility(createCourse()));

    expect(result.current.eligible).toBe(true);
    expect(result.current.validation).toEqual([]);
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

    const { result } = renderHook(() => useCheckCourseEligibility(createCourse()));

    expect(result.current.eligible).toBe(false);
    expect(result.current.validation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "conflict",
        }),
      ]),
    );
  });
});
