import { api } from "@/config/api";
import type { CourseHistory } from "@/types/course-history.type";
import type { Enrollment } from "@/types/enrollments.type";
import type { Student } from "@/types/student.type";

export type GetStudentCourseHistoryResponse = {
  courseHistory: CourseHistory[];
};

export type GetStudentProfileResponse = {
  student: Student;
};

export type GetStudentEnrollmentsResponse = {
  enrollments: Enrollment[];
};

function getStudentCourseHistory() {
  return api.get<GetStudentCourseHistoryResponse>("/me/courses/history");
}

function getStudentProfile() {
  return api.get<GetStudentProfileResponse>("/me/profile");
}

function getStudentEnrollments() {
  return api.get<GetStudentEnrollmentsResponse>("/me/enrollments");
}

export {
  getStudentCourseHistory,
  getStudentProfile,
  getStudentEnrollments,
};
