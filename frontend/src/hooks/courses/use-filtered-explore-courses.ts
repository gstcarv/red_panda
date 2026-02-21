import { useMemo } from 'react';
import { useCheckEnrollmentEligibility } from '@/hooks/enrollments/use-check-enrollment-eligibility';
import { useCourseHistory } from '@/hooks/courses/use-course-history';
import type { Course } from '@/types/course.type';
import type { ExploreCoursesFilterValues } from '@/stores/explore-courses-filter-store';

type UseFilteredExploreCoursesArgs = {
  courses: Course[];
  filter: ExploreCoursesFilterValues;
};

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

function hasMatchingMeetingTime(
  course: Course,
  selectedWeekdays: Set<string>,
  fromInMinutes: number | null,
  untilInMinutes: number | null,
) {
  const hasWeekdayFilter = selectedWeekdays.size > 0;
  const hasTimeFilter = fromInMinutes !== null || untilInMinutes !== null;

  if (!hasWeekdayFilter && !hasTimeFilter) {
    return true;
  }

  return course.availableSections.some((section) =>
    section.meetingTimes.some((meetingTime) => {
      const meetingWeekday = meetingTime.dayOfWeek.trim().toLowerCase();

      if (hasWeekdayFilter && !selectedWeekdays.has(meetingWeekday)) {
        return false;
      }

      const meetingStart = parseTimeToMinutes(meetingTime.startTime);
      const meetingEnd = parseTimeToMinutes(meetingTime.endTime);

      if (meetingStart === null || meetingEnd === null) {
        return false;
      }

      if (fromInMinutes !== null && meetingStart < fromInMinutes) {
        return false;
      }

      if (untilInMinutes !== null && meetingEnd > untilInMinutes) {
        return false;
      }

      return true;
    }),
  );
}

export function useFilteredExploreCourses({
  courses,
  filter,
}: UseFilteredExploreCoursesArgs) {
  const { evaluate } = useCheckEnrollmentEligibility();
  const { data: courseHistoryResponse } = useCourseHistory();

  const passedCourseIds = useMemo(() => {
    const courseHistory = courseHistoryResponse?.data.courseHistory ?? [];
    const ids = new Set<number>();

    for (const historyItem of courseHistory) {
      if (historyItem.status === 'passed') {
        ids.add(historyItem.courseId);
      }
    }

    return ids;
  }, [courseHistoryResponse?.data.courseHistory]);

  const eligibilityByCourseId = useMemo(() => {
    const map = new Map<number, boolean>();

    for (const course of courses) {
      map.set(course.id, evaluate(course).eligible);
    }

    return map;
  }, [courses, evaluate]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = filter.search.trim().toLowerCase();
    const selectedWeekdays = new Set(filter.weekdays.map((day) => day.toLowerCase()));
    const fromInMinutes = filter.fromTime
      ? parseTimeToMinutes(filter.fromTime)
      : null;
    const untilInMinutes = filter.untilTime
      ? parseTimeToMinutes(filter.untilTime)
      : null;

    return courses
      .filter((course) => {
        if (passedCourseIds.has(course.id)) {
          return false;
        }

        if (normalizedSearch.length > 0) {
          const courseName = course.name.toLowerCase();
          const courseCode = course.code.toLowerCase();
          const matchesSearch =
            courseName.includes(normalizedSearch) ||
            courseCode.includes(normalizedSearch);

          if (!matchesSearch) {
            return false;
          }
        }

        return hasMatchingMeetingTime(
          course,
          selectedWeekdays,
          fromInMinutes,
          untilInMinutes,
        );
      })
      .sort((courseA, courseB) => {
        const courseAIsEligible = eligibilityByCourseId.get(courseA.id) ?? false;
        const courseBIsEligible = eligibilityByCourseId.get(courseB.id) ?? false;

        if (courseAIsEligible !== courseBIsEligible) {
          return courseAIsEligible ? -1 : 1;
        }

        const nameOrder = courseA.name.localeCompare(courseB.name);
        if (nameOrder !== 0) {
          return nameOrder;
        }

        const codeOrder = courseA.code.localeCompare(courseB.code);
        if (codeOrder !== 0) {
          return codeOrder;
        }

        return courseA.id - courseB.id;
      });
  }, [courses, eligibilityByCourseId, filter, passedCourseIds]);

  return {
    filteredCourses,
    getEligible: (course: Course) => eligibilityByCourseId.get(course.id) ?? false,
    getCourseCardClassName: (course: Course) => {
      const isEligible = eligibilityByCourseId.get(course.id) ?? false;
      return !isEligible ? 'opacity-55' : undefined;
    },
  };
}
