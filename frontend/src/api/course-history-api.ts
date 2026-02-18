import { api } from "@/config/api";
import type { CourseHistory } from "@/types/course-history.type";

export type GetCourseHistoryResponse = {
  courseHistory: CourseHistory[];
};

function getCourseHistory() {
  return api.get<GetCourseHistoryResponse>("/course-history");
}

export { getCourseHistory };
