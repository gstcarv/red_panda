import { useMemo, useState } from 'react';
import { buildSlotKey, useSchedulerSlotCourses } from './use-scheduler-slot-courses';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import type { Course } from '@/types/course.type';
import type { SchedulerSlotSelection } from '@/types/scheduler.type';

type CourseWithEligibility = {
  course: Course;
  isEnrolled: boolean;
};

export function useScheduleFindCourseModal(slot: SchedulerSlotSelection | null) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { coursesBySlot, isLoading, isError } = useSchedulerSlotCourses();

  const { data: enrollmentsResponse } = useEnrollments();

  const enrolledCourseIds = useMemo(() => {
    const enrollments = enrollmentsResponse?.enrollments ?? [];
    return new Set(enrollments.map((enrollment) => enrollment.course.id));
  }, [enrollmentsResponse]);

  const coursesWithEligibility = useMemo<CourseWithEligibility[]>(() => {
    if (!slot) {
      return [];
    }

    const availableCourses = coursesBySlot.get(buildSlotKey(slot.weekDay, slot.startTime)) ?? [];

    return availableCourses.map((course) => ({
      course,
      isEnrolled: enrolledCourseIds.has(course.id),
    }));
  }, [coursesBySlot, enrolledCourseIds, slot]);

  const handleCourseDetailsOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedCourseId(null);
    }
  };

  return {
    selectedCourseId,
    setSelectedCourseId,
    coursesWithEligibility,
    isLoading,
    isError,
    handleCourseDetailsOpenChange,
  };
}
