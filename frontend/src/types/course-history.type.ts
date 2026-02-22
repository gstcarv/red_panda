import type { Semester } from './semester.type';

export interface CourseHistory {
  id: number;
  courseId: number;
  courseName: string;
  semester: Semester;
  status: 'passed' | 'failed';
  enrollment?: {
    sectionId: number;
  } | null;
}
