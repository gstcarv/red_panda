import { useMemo, useState } from 'react';
import { useAvailableCoursesBySlot } from '@/hooks/courses/use-available-courses-by-slot';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import type { Course } from '@/types/course.type';
import type { SchedulerSlotSelection } from '@/types/scheduler.type';

type CourseWithEligibility = {
  course: Course;
  eligible: boolean;
};

export function useScheduleFindCourseModal(slot: SchedulerSlotSelection | null) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const queryParams = slot
    ? {
      weekDay: slot.weekDay,
      startTime: slot.startTime,
    }
    : null;
  const { data, isLoading, isError } = useAvailableCoursesBySlot(queryParams);
  const { data: enrollmentsResponse } = useEnrollments();

  const enrolledCourseIds = useMemo(() => {
    const enrollments = enrollmentsResponse?.data.enrollments ?? [];
    return new Set(enrollments.map((enrollment) => enrollment.course.id));
  }, [enrollmentsResponse]);

  const coursesWithEligibility = useMemo<CourseWithEligibility[]>(() => {
    const availableCourses = data?.data.courses ?? [];

    return availableCourses.map((course) => ({
      course,
      eligible: course.prerequisite
        ? enrolledCourseIds.has(course.prerequisite.id)
        : true,
    }));
  }, [data, enrolledCourseIds]);

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
