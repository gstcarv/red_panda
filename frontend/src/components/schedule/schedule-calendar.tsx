import { useEffect, useRef, useState } from 'react';
import {
  Scheduler,
  type SchedulerDateClickArg,
  type SchedulerEventClickArg,
} from '@/components/ui/scheduler';
import type {
  SchedulerEvent,
  SchedulerSlotSelection,
} from '@/types/scheduler.type';
import { ScheduleFindCourseModal } from './schedule-find-course-modal';
import { CourseSectionModal } from '@/components/courses/course-section-modal';

const CALENDAR_BOTTOM_OFFSET = 40;

const WEEK_DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

function toWeekDay(date: Date): string | null {
  return WEEK_DAYS[date.getDay()] ?? null;
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

export function ScheduleCalendar({
  events,
  activeCourseId = null,
}: ScheduleCalendarProps) {
  const calendarContainerRef = useRef<HTMLElement | null>(null);
  const [calendarHeight, setCalendarHeight] = useState(720);
  const [selectedSlot, setSelectedSlot] = useState<SchedulerSlotSelection | null>(
    null,
  );
  const [isFindCourseModalOpen, setIsFindCourseModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    const updateCalendarHeight = () => {
      if (!calendarContainerRef.current) {
        return;
      }

      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const topOffset = calendarContainerRef.current.getBoundingClientRect().top;
      const availableHeight = Math.floor(
        viewportHeight - topOffset - CALENDAR_BOTTOM_OFFSET,
      );

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

    if (Number.isNaN(courseId)) {
      return;
    }

    setSelectedCourseId(courseId);
  };

  return (
    <>
      <Scheduler
        events={events}
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
      <CourseSectionModal
        courseId={selectedCourseId}
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
