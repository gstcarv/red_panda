import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScheduleCalendar } from '@/components/schedule/schedule-calendar';

const schedulerSpy = vi.fn();
const findCourseModalSpy = vi.fn();

vi.mock('@/components/ui/scheduler', () => ({
  Scheduler: (props: { testId?: string; onDateClick?: (arg: { date: Date }) => void }) => {
    schedulerSpy(props);
    return (
      <div data-testid={props.testId ?? 'ui-scheduler'} data-ui-scheduler="true" />
    );
  },
}));

vi.mock('@/components/schedule/schedule-find-course-modal', () => ({
  ScheduleFindCourseModal: (props: {
    open: boolean;
    slot: {
      weekDay: string;
      startTime: string;
      dateLabel: string;
    } | null;
  }) => {
    findCourseModalSpy(props);
    return <div data-testid="schedule-find-course-modal" />;
  },
}));

describe('ScheduleCalendar', () => {
  it('renders scheduler UI component with mapped props', () => {
    schedulerSpy.mockClear();
    findCourseModalSpy.mockClear();

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
    expect(findCourseModalSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        open: false,
        slot: null,
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

  it('opens find-course modal with selected slot on calendar click', async () => {
    schedulerSpy.mockClear();
    findCourseModalSpy.mockClear();

    render(<ScheduleCalendar events={[]} />);

    const onDateClick = schedulerSpy.mock.calls[0][0]
      .onDateClick as (arg: { date: Date }) => void;

    act(() => {
      onDateClick({
        date: new Date(2026, 1, 16, 11, 0, 0),
      } as { date: Date });
    });

    await waitFor(() => {
      expect(findCourseModalSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          open: true,
          slot: expect.objectContaining({
            weekDay: 'monday',
            startTime: '11:00',
          }),
        }),
      );
    });
  });
});
