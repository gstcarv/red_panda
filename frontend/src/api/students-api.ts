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

async function getStudentCourseHistory() {
  return (await api.get<GetStudentCourseHistoryResponse>("/me/courses/history")).data;
}

async function getStudentProfile() {
  return (await api.get<GetStudentProfileResponse>("/me/profile")).data;
}

async function getStudentEnrollments() {
  return (await api.get<GetStudentEnrollmentsResponse>("/me/enrollments")).data;
}

async function enroll(params: EnrollParams) {
  return (await api.post<EnrollResponse>("/me/enrollments", params)).data;
}

async function unenroll(courseId: number) {
  return (await api.delete<UnenrollResponse>("/me/enrollments", {
    params: { courseId },
  })).data;
}

export {
  enroll,
  getStudentCourseHistory,
  getStudentProfile,
  getStudentEnrollments,
  unenroll,
};
