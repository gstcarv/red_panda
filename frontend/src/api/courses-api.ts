import { api } from "@/config/api";
import type { Course } from "@/types/course.type";

export type CoursesResponse = {
    courses: Course[];
};

function getCourses() {
    return api.get<CoursesResponse>("/courses");
}

function getCourseById(id: number) {
    return api.get<Course>(`/courses/${id}`);
}

export { getCourses, getCourseById };
