import { api } from "@/config/api";
import type { Enrollment } from "@/types/enrollments.type";

export type GetEnrollmentsResponse = {
    enrollments: Enrollment[];
};

export type EnrollParams = {
    studentId: number;
    courseId: number;
    sectionId: number;
};

export type EnrollResponse = {
    enrollment: Enrollment;
};

export type UnenrollResponse = {
    enrollment: Enrollment;
};

function enroll(params: EnrollParams) {
    return api.post<EnrollResponse>("/enrollments", params);
}

function unenroll(enrollmentId: string) {
    return api.delete<UnenrollResponse>(`/enrollments/${enrollmentId}`);
}

function getEnrollments() {
    return api.get<GetEnrollmentsResponse>("/enrollments");
}

export { enroll, unenroll, getEnrollments };
