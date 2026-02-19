import { useMemo } from 'react';
import type { Course, CourseSection } from '@/types/course.type';
import { useEnrollments } from '../enrollments/use-enrollments';
import { useCourseHistory } from './use-course-history';

export type CourseStudentStatus = 'enrolled' | 'passed' | 'failed';

type CheckCourseStatusReturn = {
  status?: CourseStudentStatus;
  enrolledSections: CourseSection[];
  isLoading: boolean;
  isError: boolean;
};

export function useCheckCourseStatus(course: Course): CheckCourseStatusReturn {
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

  const enrollments = enrollmentsResponse?.data.enrollments;
  const courseHistory = courseHistoryResponse?.data.courseHistory;

  const enrolledSections = useMemo(() => {
    return (enrollments ?? [])
      .filter((enrollment) => enrollment.course.id === course.id)
      .map((enrollment) => enrollment.courseSection);
  }, [enrollments, course.id]);

  const status = useMemo<CourseStudentStatus | undefined>(() => {
    const items = (courseHistory ?? []).filter((h) => h.courseId === course.id);

    if (items.find((h) => h.status === 'passed')) return 'passed';

    if (enrolledSections.length > 0) return 'enrolled';

    if (items.find((h) => h.status === 'failed')) return 'failed';

    return undefined;
  }, [course.id, courseHistory, enrolledSections.length]);

  return {
    status,
    enrolledSections,
    isLoading: isEnrollmentsLoading || isCourseHistoryLoading,
    isError: isEnrollmentsError || isCourseHistoryError,
  };
}

