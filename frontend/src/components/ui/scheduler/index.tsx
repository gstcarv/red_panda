import type { Ref } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin, {
  type DateClickArg,
} from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import type { SchedulerEvent } from '@/types/scheduler.type';
import './scheduler.css';

type SchedulerProps = {
  events: SchedulerEvent[];
  height: number;
  activeCourseId?: number | null;
  onDateClick?: (arg: DateClickArg) => void;
  onEventClick?: (arg: EventClickArg) => void;
  containerRef?: Ref<HTMLElement>;
  testId?: string;
  ariaLabel?: string;
};

export type SchedulerDateClickArg = DateClickArg;
export type SchedulerEventClickArg = EventClickArg;

export function Scheduler({
  events,
  height,
  activeCourseId = null,
  onDateClick,
  onEventClick,
  containerRef,
  testId,
  ariaLabel = 'Weekly calendar',
}: SchedulerProps) {
  return (
    <section
      aria-label={ariaLabel}
      data-testid={testId}
      className="ui-scheduler"
      ref={containerRef}
    >
      <div className="ui-scheduler-hover-cell" aria-hidden />

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={false}
        allDaySlot={false}
        firstDay={1}
        weekends={false}
        slotDuration="01:00:00"
        slotLabelInterval="01:00:00"
        slotMinTime="05:00:00"
        slotMaxTime="18:00:00"
        events={events}
        height={height}
        dayHeaderFormat={{ weekday: 'short' }}
        dateClick={onDateClick}
        eventClick={onEventClick}
        eventClassNames={(arg) => {
          if (activeCourseId === null) {
            return [];
          }

          const eventCourseId = Number(arg.event.extendedProps.courseId);
          return eventCourseId === activeCourseId
            ? ['ui-scheduler-event-highlighted']
            : ['ui-scheduler-event-dimmed'];
        }}
      />
    </section>
  );
}
