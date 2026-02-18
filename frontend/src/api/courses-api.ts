import { api } from "@/config/api";
import type { Course, CourseDetails } from "@/types/course.type";

export type CoursesResponse = {
    courses: Course[];
};

function getCourses() {
    return api.get<CoursesResponse>("/courses");
}

function getCourseById(id: number) {
    return api.get<CourseDetails>(`/courses/${id}`);
}

export { getCourses, getCourseById };
