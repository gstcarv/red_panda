import { api } from "@/config/api";
import type { Enrollment } from "@/types/enrollments.type";

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
    return api.post<EnrollResponse>("/me/enrollments", params);
}

function unenroll(courseId: number) {
    return api.delete<UnenrollResponse>("/me/enrollments", {
        params: { courseId },
    });
}

export { enroll, unenroll };
