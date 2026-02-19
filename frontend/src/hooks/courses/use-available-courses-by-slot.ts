import { useMemo } from 'react';
import { useCourses } from '@/hooks/courses/use-courses';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useCourseHistory } from '@/hooks/courses/use-course-history';
import { useStudent } from '@/hooks/students/use-student';
import { evaluateCourseEligibility } from '@/hooks/courses/use-check-course-eligibility';
import type { Course } from '@/types/course.type';

const SLOT_INTERVAL_IN_MINUTES = 60;

function parseTimeToMinutes(value: string): number | null {
  const [hours, minutes] = value.split(':').map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function formatMinutesToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function buildSlotKey(weekDay: string, startTime: string) {
  return `${weekDay.trim().toLowerCase()}|${startTime}`;
}

function addCourseToSlot(
  bySlot: Map<string, Course[]>,
  slotKey: string,
  course: Course,
) {
  const existingCourses = bySlot.get(slotKey);

  if (!existingCourses) {
    bySlot.set(slotKey, [course]);
    return;
  }

  if (existingCourses.some((existingCourse) => existingCourse.id === course.id)) {
    return;
  }

  existingCourses.push(course);
}

export function useAvailableCoursesBySlot() {
  const coursesQuery = useCourses();
  const enrollmentsQuery = useEnrollments();
  const courseHistoryQuery = useCourseHistory();
  const studentQuery = useStudent();
  const courses = coursesQuery.data?.data.courses;
  const enrollments = enrollmentsQuery.data?.data.enrollments;
  const courseHistory = courseHistoryQuery.data?.data.courseHistory;
  const student = studentQuery.data?.data.student;

  const coursesBySlot = useMemo(() => {
    const bySlot = new Map<string, Course[]>();

    for (const course of courses ?? []) {
      const { eligible } = evaluateCourseEligibility({
        course,
        enrollments: enrollments ?? [],
        courseHistory: courseHistory ?? [],
        student,
        isCourseHistoryLoading: courseHistoryQuery.isLoading,
      });

      if (!eligible) {
        continue;
      }

      for (const section of course.availableSections) {
        for (const meetingTime of section.meetingTimes) {
          const normalizedWeekDay = meetingTime.dayOfWeek.trim().toLowerCase();
          const startInMinutes = parseTimeToMinutes(meetingTime.startTime);
          const endInMinutes = parseTimeToMinutes(meetingTime.endTime);

          if (
            normalizedWeekDay.length === 0 ||
            startInMinutes === null ||
            endInMinutes === null ||
            endInMinutes <= startInMinutes
          ) {
            continue;
          }

          for (
            let slotStart = startInMinutes;
            slotStart < endInMinutes;
            slotStart += SLOT_INTERVAL_IN_MINUTES
          ) {
            const slotKey = buildSlotKey(
              normalizedWeekDay,
              formatMinutesToTime(slotStart),
            );
            addCourseToSlot(bySlot, slotKey, course);
          }
        }
      }
    }

    return bySlot;
  }, [courseHistory, courseHistoryQuery.isLoading, courses, enrollments, student]);

  return {
    ...coursesQuery,
    isLoading:
      coursesQuery.isLoading ||
      courseHistoryQuery.isLoading ||
      studentQuery.isLoading,
    isError:
      coursesQuery.isError ||
      courseHistoryQuery.isError ||
      studentQuery.isError,
    coursesBySlot,
  };
}
