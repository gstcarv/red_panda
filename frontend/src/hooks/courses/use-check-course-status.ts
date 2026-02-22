import type { CourseHistory } from '@/types/course-history.type';
import type { Course, CourseSection } from '@/types/course.type';
import { useEnrollments } from '../enrollments/use-enrollments';
import { useCourseHistory } from './use-course-history';

export type CourseStudentStatus = 'enrolled' | 'passed' | 'failed';

type CheckCourseStatusReturn = {
  status?: CourseStudentStatus;
  foundCourseHistory?: CourseHistory;
  enrolledSections: CourseSection[];
  isLoading: boolean;
  isError: boolean;
};

export function useCheckCourseStatus(
  course?: Course | null,
  semesterId?: number | null,
): CheckCourseStatusReturn {
  const {
    data: enrollmentsResponse,
    isLoading: isEnrollmentsLoading,
    isError: isEnrollmentsError,
  } = useEnrollments();
  const {
    data: courseHistoryResponse,
    isLoading: isCourseHistoryLoading,
    isError: isCourseHistoryError,
  } = useCourseHistory();

  const enrollments = enrollmentsResponse?.enrollments;
  const courseHistory = courseHistoryResponse?.courseHistory;
  const selectedSemesterId = semesterId ?? null;

  const enrolledSections: CourseSection[] = !course
    ? []
    : (enrollments ?? [])
        .filter((enrollment) => {
          if (enrollment.course.id !== course.id) {
            return false;
          }

          if (selectedSemesterId === null) {
            return true;
          }

          return enrollment.semester.id === selectedSemesterId;
        })
        .map((enrollment) => enrollment.courseSection);

  const filteredHistory: CourseHistory[] = !course
    ? []
    : (courseHistory ?? []).filter((historyItem) => {
        if (historyItem.courseId !== course.id) {
          return false;
        }

        if (selectedSemesterId === null) {
          return true;
        }

        return historyItem.semester.id === selectedSemesterId;
      });

  const foundCourseHistory =
    filteredHistory.find((historyItem) => historyItem.status === 'passed') ??
    filteredHistory.find((historyItem) => historyItem.status === 'failed');

  let status: CourseStudentStatus | undefined;

  if (foundCourseHistory?.status === 'passed') {
    status = 'passed';
  } else if (enrolledSections.length > 0) {
    status = 'enrolled';
  } else if (foundCourseHistory?.status === 'failed') {
    status = 'failed';
  }

  return {
    status,
    foundCourseHistory: status === 'enrolled' ? undefined : foundCourseHistory,
    enrolledSections,
    isLoading: isEnrollmentsLoading || isCourseHistoryLoading,
    isError: isEnrollmentsError || isCourseHistoryError,
  };
}
