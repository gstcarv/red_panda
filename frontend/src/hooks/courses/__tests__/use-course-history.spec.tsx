import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as courseHistoryApi from "@/api/course-history-api";
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
    expect(buildCourseHistoryQueryKey()).toEqual(["course-history"]);
  });

  it("loads course history data from api", async () => {
    const response = {
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
    };
    const getCourseHistorySpy = vi
      .spyOn(courseHistoryApi, "getCourseHistory")
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
