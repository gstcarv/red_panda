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

function enroll(params: EnrollParams) {
    return api.post<EnrollResponse>("/enrollments", params);
}

function getEnrollments() {
    return api.get<GetEnrollmentsResponse>("/enrollments");
}

export { enroll, getEnrollments };
