import { api } from "@/config/api";
import type { Course } from "@/types/course.type";

export type CoursesResponse = {
    courses: Course[];
};

function getCourses() {
    return api.get<CoursesResponse>("/courses");
}

function getCourseById(id: number, semesterId?: number) {
    return api.get<Course>(`/courses/${id}`, {
        params: semesterId === undefined ? undefined : { semesterId },
    });
}

export { getCourses, getCourseById };
