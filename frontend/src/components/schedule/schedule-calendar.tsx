import { useEffect, useRef, useState } from 'react';
import {
  Scheduler,
  type SchedulerDateClickArg,
} from '@/components/ui/scheduler';
import type { SchedulerEvent } from '@/types/scheduler.type';

const CALENDAR_BOTTOM_OFFSET = 40;

function getIsoWeekNumber(date: Date): number {
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
}

type ScheduleCalendarProps = {
  events: SchedulerEvent[];
};

export function ScheduleCalendar({ events }: ScheduleCalendarProps) {
  const calendarContainerRef = useRef<HTMLElement | null>(null);
  const [calendarHeight, setCalendarHeight] = useState(720);

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
    const week = getIsoWeekNumber(arg.date);
    console.log(`[Schedule] Semana ${week} | Data ${arg.dateStr}`);
  };

  return (
    <Scheduler
      events={events}
      height={calendarHeight}
      onDateClick={handleDateClick}
      containerRef={calendarContainerRef}
      testId="schedule-calendar"
      ariaLabel="Weekly calendar"
    />
  );
}
