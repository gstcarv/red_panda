import { api } from "@/config/api";
import type { Course } from "@/types/course.type";

export type CoursesResponse = {
    courses: Course[];
};

export type AvailableCoursesBySlotParams = {
    startTime: string;
    weekDay: string;
};

export type AvailableCoursesBySlotResponse = {
    courses: Course[];
};

function getCourses() {
    return api.get<CoursesResponse>("/courses");
}

function getCourseById(id: number) {
    return api.get<Course>(`/courses/${id}`);
}

function getAvailableCoursesBySlot({
    startTime,
    weekDay,
}: AvailableCoursesBySlotParams) {
    return api.get<AvailableCoursesBySlotResponse>("/courses/available", {
        params: {
            startTime,
            weekDay,
        },
    });
}

export { getCourses, getCourseById, getAvailableCoursesBySlot };
