import type { Course, CourseSection } from "./course.type";
import type { Semester } from "./semester.type";

export interface Enrollment {
    id: string;
    course: Course;
    courseSection: CourseSection;
    semester: Semester;
}