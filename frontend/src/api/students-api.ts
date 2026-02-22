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

export type EnrollParams = {
  courseId: number;
  sectionId: number;
};

export type EnrollResponse = {
  enrollment: Enrollment;
};

export type UnenrollResponse = {
  enrollment: Enrollment;
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

function enroll(params: EnrollParams) {
  return api.post<EnrollResponse>("/me/enrollments", params);
}

function unenroll(courseId: number) {
  return api.delete<UnenrollResponse>("/me/enrollments", {
    params: { courseId },
  });
}

export {
  enroll,
  getStudentCourseHistory,
  getStudentProfile,
  getStudentEnrollments,
  unenroll,
};
