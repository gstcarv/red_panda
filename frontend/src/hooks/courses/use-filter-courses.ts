import { useMemo } from 'react';
import { useCheckEnrollmentEligibility } from '@/hooks/enrollments/use-check-enrollment-eligibility';
import { useCourseHistory } from '@/hooks/courses/use-course-history';
import type { Course } from '@/types/course.type';
import type { ExploreCoursesFilterValues } from '@/stores/explore-courses-filter-store';
import { normalizeWeekday, parseTimeToMinutes } from '@/helpers/date-helper';

type UseFilterCoursesArgs = {
  courses: Course[];
  filter: ExploreCoursesFilterValues;
};

type MeetingTimeFilter = {
  selectedWeekdays: Set<string>;
  fromInMinutes: number | null;
  untilInMinutes: number | null;
};

function buildMeetingTimeFilter(filter: ExploreCoursesFilterValues): MeetingTimeFilter {
  return {
    selectedWeekdays: new Set(filter.weekdays.map(normalizeWeekday)),
    fromInMinutes: filter.fromTime ? parseTimeToMinutes(filter.fromTime) : null,
    untilInMinutes: filter.untilTime ? parseTimeToMinutes(filter.untilTime) : null,
  };
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
      const meetingWeekday = normalizeWeekday(meetingTime.dayOfWeek);

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

function passesCompletedCourseFilter(course: Course, passedCourseIds: Set<number>) {
  return !passedCourseIds.has(course.id);
}

function passesSearchFilter(course: Course, normalizedSearch: string) {
  if (normalizedSearch.length === 0) {
    return true;
  }

  const courseName = course.name.toLowerCase();
  const courseCode = course.code.toLowerCase();

  return courseName.includes(normalizedSearch) || courseCode.includes(normalizedSearch);
}

function passesMeetingTimeFilter(course: Course, meetingTimeFilter: MeetingTimeFilter) {
  return hasMatchingMeetingTime(
    course,
    meetingTimeFilter.selectedWeekdays,
    meetingTimeFilter.fromInMinutes,
    meetingTimeFilter.untilInMinutes,
  );
}

function sortCoursesByEligibilityAndName(
  courses: Course[],
  eligibilityByCourseId: Map<number, boolean>,
) {
  return courses.sort((courseA, courseB) => {
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
}

export function useFilterCourses({ courses, filter }: UseFilterCoursesArgs) {
  const { evaluate } = useCheckEnrollmentEligibility();
  const { data: courseHistoryResponse } = useCourseHistory();

  const passedCourseIds = useMemo(() => {
    const courseHistory = courseHistoryResponse?.courseHistory ?? [];
    const ids = new Set<number>();

    for (const historyItem of courseHistory) {
      if (historyItem.status === 'passed') {
        ids.add(historyItem.courseId);
      }
    }

    return ids;
  }, [courseHistoryResponse?.courseHistory]);

  const eligibilityByCourseId = useMemo(() => {
    const map = new Map<number, boolean>();

    for (const course of courses) {
      map.set(course.id, evaluate(course).eligible);
    }

    return map;
  }, [courses, evaluate]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = filter.search.trim().toLowerCase();
    const meetingTimeFilter = buildMeetingTimeFilter(filter);

    const filtered = courses.filter((course) => {
      if (!passesCompletedCourseFilter(course, passedCourseIds)) {
        return false;
      }

      if (!passesSearchFilter(course, normalizedSearch)) {
        return false;
      }

      return passesMeetingTimeFilter(course, meetingTimeFilter);
    });

    return sortCoursesByEligibilityAndName(filtered, eligibilityByCourseId);
  }, [courses, eligibilityByCourseId, filter, passedCourseIds]);

  return {
    filteredCourses,
  };
}
