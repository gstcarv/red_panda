import { useMemo } from 'react';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import type { SchedulerEvent } from '@/types/scheduler.type';

const DAY_OF_WEEK_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function toDayIndex(dayOfWeek: string): number | null {
  const dayIndex = DAY_OF_WEEK_TO_INDEX[dayOfWeek.toLowerCase()];
  return dayIndex ?? null;
}

export function useSchedulerEnrollments() {
  const enrollmentsQuery = useEnrollments();

  const events = useMemo<SchedulerEvent[]>(() => {
    const enrollments = enrollmentsQuery.data?.data.enrollments ?? [];

    return enrollments.flatMap((enrollment) => {
      const title = `${enrollment.course.code} - ${enrollment.course.name}`;

      return enrollment.courseSection.meetingTimes.flatMap((meetingTime) => {
        const dayIndex = toDayIndex(meetingTime.dayOfWeek);

        if (dayIndex === null) {
          return [];
        }

        return [
          {
            id: `${enrollment.id}-${enrollment.courseSection.id}-${dayIndex}-${meetingTime.startTime}`,
            title,
            daysOfWeek: [dayIndex],
            startTime: meetingTime.startTime,
            endTime: meetingTime.endTime,
          },
        ];
      });
    });
  }, [enrollmentsQuery.data]);

  return {
    ...enrollmentsQuery,
    events,
  };
}
