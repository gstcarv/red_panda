import type { Semester } from './semester.type';

export interface CoursePrerequisite {
  id: number;
  code: string;
  name: string;
}

export interface CourseGradeLevel {
  min: number;
  max: number;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  hoursPerWeek: number;
  prerequisite?: CoursePrerequisite;
  gradeLevel: CourseGradeLevel;
  availableSections: CourseSection[];
  semester?: Semester;
}

export interface CourseSection {
  id: number;
  teacher: {
    id: number;
    name: string;
  };
  meetingTimes: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
  capacity: number;
  enrolledCount: number;
}
