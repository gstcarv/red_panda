import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Schedule } from '@/pages/schedule';
import { useSchedulerEnrollments } from '@/hooks/enrollments/use-scheduler-enrollments';

const scheduleCalendarSpy = vi.fn();
const schedulerListSpy = vi.fn();

vi.mock('@/hooks/enrollments/use-scheduler-enrollments', () => ({
  useSchedulerEnrollments: vi.fn(),
}));

vi.mock('@/components/schedule', () => ({
  ScheduleCalendar: ({ events }: { events: unknown[] }) => {
    scheduleCalendarSpy({ events });
    return <div data-testid="schedule-calendar" />;
  },
  SchedulerList: () => {
    schedulerListSpy();
    return <div data-testid="scheduler-list" />;
  },
}));

const mockedUseSchedulerEnrollments = vi.mocked(useSchedulerEnrollments);

describe('Schedule', () => {
  it('renders schedule heading and description', () => {
    mockedUseSchedulerEnrollments.mockReturnValue({
      events: [{ id: 'event-1', title: 'Event 1' }],
    } as never);

    render(<Schedule />);

    expect(
      screen.getByRole('heading', { name: 'Schedule', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your schedule for the current semester.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('schedule-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('scheduler-list')).toBeInTheDocument();
    expect(schedulerListSpy).toHaveBeenCalledTimes(1);
    expect(scheduleCalendarSpy).toHaveBeenCalledWith({
      events: [{ id: 'event-1', title: 'Event 1' }],
    });
  });
});
