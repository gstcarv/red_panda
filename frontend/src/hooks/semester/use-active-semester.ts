import { useStudent } from '../students/use-student';

export function useActiveSemester() {
  const student = useStudent();
  return student.data?.student.activeSemester;
}
