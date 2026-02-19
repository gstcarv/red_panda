import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as studentsApi from "@/api/students-api";
import {
  buildCourseHistoryQueryKey,
  useCourseHistory,
} from "@/hooks/courses/use-course-history";

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

describe("useCourseHistory", () => {
  it("builds a stable course history query key", () => {
    expect(buildCourseHistoryQueryKey()).toEqual(["me", "courses", "history"]);
  });

  it("loads course history data from api", async () => {
    const response = {
      data: {
        courseHistory: [
          {
            id: 1,
            courseId: 2,
            courseName: "Introduction to Programming",
            semester: {
              id: 1,
              name: "Fall",
              year: 2024,
              order_in_year: 1,
            },
            status: "passed",
          },
        ],
      },
    };
    const getCourseHistorySpy = vi
      .spyOn(studentsApi, "getStudentCourseHistory")
      .mockResolvedValue(response as never);

    const { result } = renderHook(() => useCourseHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getCourseHistorySpy).toHaveBeenCalledTimes(1);
    expect(result.current.data?.data.courseHistory).toHaveLength(1);
    expect(result.current.data?.data.courseHistory[0].status).toBe("passed");
  });
});
