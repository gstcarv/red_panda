import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Scheduler } from '@/components/ui/scheduler';

const fullCalendarSpy = vi.fn();

vi.mock('@fullcalendar/react', () => ({
  default: ({
    plugins,
    initialView,
    headerToolbar,
    allDaySlot,
    firstDay,
    weekends,
    slotDuration,
    slotLabelInterval,
    slotMinTime,
    slotMaxTime,
    events,
    height,
    dayHeaderFormat,
    dateClick,
  }: {
    plugins: unknown[];
    initialView: string;
    headerToolbar: false;
    allDaySlot: boolean;
    firstDay: number;
    weekends: boolean;
    slotDuration: string;
    slotLabelInterval: string;
    slotMinTime: string;
    slotMaxTime: string;
    events: Array<{ id: string; title: string }>;
    height: number;
    dayHeaderFormat: { weekday: string };
    dateClick: (arg: { date: Date; dateStr: string }) => void;
  }) => {
    fullCalendarSpy({
      plugins,
      initialView,
      headerToolbar,
      allDaySlot,
      firstDay,
      weekends,
      slotDuration,
      slotLabelInterval,
      slotMinTime,
      slotMaxTime,
      events,
      height,
      dayHeaderFormat,
      dateClick,
    });
    return <div data-testid="full-calendar" />;
  },
}));

vi.mock('@fullcalendar/timegrid', () => ({
  default: { name: 'timeGridPluginMock' },
}));

vi.mock('@fullcalendar/interaction', () => ({
  default: { name: 'interactionPluginMock' },
}));

describe('Scheduler', () => {
  it('renders fullcalendar with scheduler defaults', () => {
    const onDateClick = vi.fn();

    render(
      <Scheduler
        events={[
          {
            id: 'enroll-1-101-1-09:00',
            title: 'MATH101 - Algebra I',
            daysOfWeek: [1],
            startTime: '09:00',
            endTime: '10:00',
          },
        ]}
        height={700}
        onDateClick={onDateClick}
        testId="scheduler-root"
      />,
    );

    expect(screen.getByTestId('scheduler-root')).toBeInTheDocument();
    expect(screen.getByTestId('full-calendar')).toBeInTheDocument();
    expect(fullCalendarSpy).toHaveBeenCalledWith({
      plugins: expect.any(Array),
      initialView: 'timeGridWeek',
      headerToolbar: false,
      allDaySlot: false,
      firstDay: 1,
      weekends: false,
      slotDuration: '01:00:00',
      slotLabelInterval: '01:00:00',
      slotMinTime: '05:00:00',
      slotMaxTime: '18:00:00',
      events: expect.arrayContaining([
        expect.objectContaining({
          id: 'enroll-1-101-1-09:00',
          title: 'MATH101 - Algebra I',
        }),
      ]),
      height: 700,
      dayHeaderFormat: {
        weekday: 'short',
      },
      dateClick: onDateClick,
    });
  });
});
