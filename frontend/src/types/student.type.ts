export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  gradeLevel: number;
  email: string;
  gpa: number;
  credits: {
    earned: number;
    max: number;
  };
  options: {
    maxCoursesPerSemester: number;
  };
  activeSemester?: {
    id: number;
    name: string;
    year: number;
    orderInYear: number;
  } | null;
}
