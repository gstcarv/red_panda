import type { Course, CourseSection } from "./course.type";

export interface Enrollment {
    id: string;
    course: Course;
    courseSection: CourseSection;
}