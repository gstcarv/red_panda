import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScheduleCalendar } from '@/components/schedule/schedule-calendar';

const schedulerSpy = vi.fn();

vi.mock('@/components/ui/scheduler', () => ({
  Scheduler: (props: { testId?: string }) => {
    schedulerSpy(props);
    return (
      <div data-testid={props.testId ?? 'ui-scheduler'} data-ui-scheduler="true" />
    );
  },
}));

describe('ScheduleCalendar', () => {
  it('renders scheduler UI component with mapped props', () => {
    schedulerSpy.mockClear();

    render(
      <ScheduleCalendar
        events={[
          {
            id: 'enroll-1-101-1-09:00',
            courseId: 1,
            title: 'MATH101 - Algebra I',
            daysOfWeek: [1],
            startTime: '09:00',
            endTime: '10:00',
          },
        ]}
      />,
    );

    expect(screen.getByTestId('schedule-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-calendar')).toBeInTheDocument();

    expect(schedulerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ariaLabel: 'Weekly calendar',
        testId: 'schedule-calendar',
        height: expect.any(Number),
        containerRef: expect.any(Object),
        onDateClick: expect.any(Function),
      }),
    );

    expect(schedulerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
      events: expect.arrayContaining([
        expect.objectContaining({
          id: 'enroll-1-101-1-09:00',
          title: 'MATH101 - Algebra I',
        }),
      ]),
      }),
    );
  });
});
