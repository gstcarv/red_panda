export interface CourseHistory {
  id: number;
  courseId: number;
  courseName: string;
  semesterId: number;
  status: 'passed' | 'failed';
}