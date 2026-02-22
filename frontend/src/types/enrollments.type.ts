import type { Course, CoursePrerequisite, CourseSection } from './course.type';
import type { Semester } from './semester.type';

export interface Enrollment {
  id: string;
  course: Course;
  courseSection: CourseSection;
  semester: Semester;
}

export interface EnrollmentAvailabilityError {
  type: 'prerequisite' | 'conflict' | 'max_courses' | 'grade_level' | 'other';
  message: string;
  prerequisite?: CoursePrerequisite;
}
