import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Scheduler,
  type SchedulerDateClickArg,
  type SchedulerEventClickArg,
} from '@/components/ui/scheduler';
import { useSchedulerSlotCourses } from '@/hooks/schedule/use-scheduler-slot-courses';
import type { SchedulerEvent, SchedulerSlotSelection } from '@/types/scheduler.type';
import { ScheduleFindCourseModal } from './schedule-find-course-modal';
import { CourseDetailsModal } from '@/components/courses/course-details-modal';
import { useActiveSemester } from '@/hooks/semester/use-active-semester';
import { addMinutesToTime, indexToWeekday, parseTimeToMinutes, weekdayToIndex } from '@/helpers/date-helper';
import { pluralize } from '@/helpers/string-helper';

const CALENDAR_BOTTOM_OFFSET = 40;

function hasRegularEventInSlot(
  regularEvents: SchedulerEvent[],
  dayIndex: number,
  slotStartTime: string,
): boolean {
  const slotStartInMinutes = parseTimeToMinutes(slotStartTime);
  if (slotStartInMinutes === null) {
    return false;
  }

  return regularEvents.some((event) => {
    if (event.isSlotHint || !event.daysOfWeek.includes(dayIndex)) {
      return false;
    }

    const eventStart = parseTimeToMinutes(event.startTime);
    const eventEnd = parseTimeToMinutes(event.endTime);
    if (eventStart === null || eventEnd === null || eventEnd <= eventStart) {
      return false;
    }

    return slotStartInMinutes >= eventStart && slotStartInMinutes < eventEnd;
  });
}

function toWeekDay(date: Date): string | null {
  return indexToWeekday(date.getDay());
}

function toStartTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function toDateLabel(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type ScheduleCalendarProps = {
  events: SchedulerEvent[];
  activeCourseId?: number | null;
};

export function ScheduleCalendar({ events, activeCourseId = null }: ScheduleCalendarProps) {
  const { coursesBySlot } = useSchedulerSlotCourses();
  const semester = useActiveSemester();
  const calendarContainerRef = useRef<HTMLElement | null>(null);
  const [calendarHeight, setCalendarHeight] = useState(720);
  const [selectedSlot, setSelectedSlot] = useState<SchedulerSlotSelection | null>(null);
  const [isFindCourseModalOpen, setIsFindCourseModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    const updateCalendarHeight = () => {
      if (!calendarContainerRef.current) {
        return;
      }

      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const topOffset = calendarContainerRef.current.getBoundingClientRect().top;
      const availableHeight = Math.floor(viewportHeight - topOffset - CALENDAR_BOTTOM_OFFSET);

      setCalendarHeight(Math.max(360, availableHeight));
    };

    updateCalendarHeight();
    window.addEventListener('resize', updateCalendarHeight);

    return () => {
      window.removeEventListener('resize', updateCalendarHeight);
    };
  }, []);

  const handleDateClick = (arg: SchedulerDateClickArg) => {
    const weekDay = toWeekDay(arg.date);

    if (!weekDay) {
      return;
    }

    setSelectedSlot({
      weekDay,
      startTime: toStartTime(arg.date),
      dateLabel: toDateLabel(arg.date),
    });
    setIsFindCourseModalOpen(true);
  };

  const handleFindCourseModalOpenChange = (open: boolean) => {
    setIsFindCourseModalOpen(open);

    if (!open) {
      setSelectedSlot(null);
    }
  };

  const handleEventClick = (arg: SchedulerEventClickArg) => {
    const courseId = Number(arg.event.extendedProps.courseId);

    if (Number.isNaN(courseId) || courseId <= 0) {
      return;
    }

    setSelectedCourseId(courseId);
  };

  const calendarEvents = useMemo<SchedulerEvent[]>(() => {
    const slotHintEvents: SchedulerEvent[] = [];

    for (const [slotKey, courses] of coursesBySlot.entries()) {
      const [weekDay, startTime] = slotKey.split('|');
      const dayIndex = weekdayToIndex(weekDay ?? '');
      const endTime = addMinutesToTime(startTime ?? '', 60);

      if (dayIndex === null || !startTime || endTime === null || courses.length === 0) {
        continue;
      }

      if (hasRegularEventInSlot(events, dayIndex, startTime)) {
        continue;
      }

      slotHintEvents.push({
        id: `slot-hint-${dayIndex}-${startTime}`,
        title: `${courses.length} ${pluralize(courses.length, 'course')} available`,
        daysOfWeek: [dayIndex],
        startTime,
        endTime,
        isSlotHint: true,
      });
    }

    return [...slotHintEvents, ...events];
  }, [coursesBySlot, events]);

  return (
    <>
      <Scheduler
        events={calendarEvents}
        height={calendarHeight}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        containerRef={calendarContainerRef}
        activeCourseId={activeCourseId}
        testId="schedule-calendar"
        ariaLabel="Weekly calendar"
      />

      <ScheduleFindCourseModal
        open={isFindCourseModalOpen}
        slot={selectedSlot}
        onOpenChange={handleFindCourseModalOpenChange}
      />

      <CourseDetailsModal
        courseId={selectedCourseId}
        semesterId={semester?.id}
        open={selectedCourseId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCourseId(null);
          }
        }}
      />
    </>
  );
}
