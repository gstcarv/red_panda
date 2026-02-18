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
  const selectedSemesterId = course.semester?.id;

  const enrolledSections = useMemo(() => {
    return (enrollments ?? [])
      .filter((enrollment) => {
        if (enrollment.course.id !== course.id) return false;
        if (selectedSemesterId == null) return true;
        return enrollment.semester.id === selectedSemesterId;
      })
      .map((enrollment) => enrollment.courseSection);
  }, [enrollments, course.id, selectedSemesterId]);

  const status = useMemo<CourseStudentStatus | undefined>(() => {
    const enrolledSemesterIds = new Set(
      (enrollments ?? [])
        .filter((enrollment) => enrollment.course.id === course.id)
        .map((enrollment) => enrollment.semester.id),
    );

    const items = (courseHistory ?? []).filter((h) => {
      if (h.courseId !== course.id) return false;
      if (selectedSemesterId != null) {
        return h.semester.id === selectedSemesterId;
      }
      if (enrolledSemesterIds.size > 0) {
        return enrolledSemesterIds.has(h.semester.id);
      }
      return true;
    });

    if (items.find((h) => h.status === 'passed')) return 'passed';

    if (enrolledSections.length > 0) return 'enrolled';

    if (items.find((h) => h.status === 'failed')) return 'failed';

    return undefined;
  }, [course.id, courseHistory, enrollments, enrolledSections.length, selectedSemesterId]);

  return {
    status,
    enrolledSections,
    isLoading: isEnrollmentsLoading || isCourseHistoryLoading,
    isError: isEnrollmentsError || isCourseHistoryError,
  };
}

