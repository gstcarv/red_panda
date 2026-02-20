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

  const enrollments = enrollmentsResponse?.data.enrollments;
  const courseHistory = courseHistoryResponse?.data.courseHistory;
  const selectedSemesterId = semesterId ?? null;

  const enrolledSections = useMemo(() => {
    if (!course) {
      return [];
    }

    return (enrollments ?? [])
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
  }, [course, enrollments, selectedSemesterId]);

  const status = useMemo<CourseStudentStatus | undefined>(() => {
    if (!course) {
      return undefined;
    }

    const items = (courseHistory ?? []).filter((h) => {
      if (h.courseId !== course.id) {
        return false;
      }

      if (selectedSemesterId === null) {
        return true;
      }

      return h.semester.id === selectedSemesterId;
    });

    if (items.find((h) => h.status === 'passed')) return 'passed';

    if (enrolledSections.length > 0) return 'enrolled';

    if (items.find((h) => h.status === 'failed')) return 'failed';


    return undefined;
  }, [course, courseHistory, enrolledSections.length, selectedSemesterId]);

  return {
    status,
    enrolledSections,
    isLoading: isEnrollmentsLoading || isCourseHistoryLoading,
    isError: isEnrollmentsError || isCourseHistoryError,
  };
}

