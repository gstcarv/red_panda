import { api } from "@/config/api";
import type { CourseHistory } from "@/types/course-history.type";
import type { Student } from "@/types/student.type";

export type GetStudentCourseHistoryResponse = {
  courseHistory: CourseHistory[];
};

export type GetStudentProfileResponse = {
  student: Student;
};

function getStudentCourseHistory(studentId: number) {
  return api.get<GetStudentCourseHistoryResponse>(
    `/students/${studentId}/courses/history`,
  );
}

function getStudentProfile(studentId: number) {
  return api.get<GetStudentProfileResponse>(`/student/${studentId}/profile`);
}

export { getStudentCourseHistory, getStudentProfile };
