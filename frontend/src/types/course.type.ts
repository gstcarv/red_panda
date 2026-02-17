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
}
