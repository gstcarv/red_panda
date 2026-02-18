import { api } from "@/config/api";
import type { Course } from "@/types/course.type";

export type CoursesResponse = {
    courses: Course[];
};

export type EnrollParams = {
    studentId: number;
    courseId: number;
    sectionId: number;
};

function enroll(params: EnrollParams) {
    return api.post<CoursesResponse>("/enrollments", params);
}

export { enroll };
