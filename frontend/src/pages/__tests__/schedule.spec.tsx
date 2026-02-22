import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Schedule } from '@/pages/schedule';
import { useSchedulerEnrollments } from '@/hooks/schedule/use-scheduler-enrollments';

const scheduleCalendarSpy = vi.fn();
const schedulerListSpy = vi.fn();

vi.mock('@/hooks/schedule/use-scheduler-enrollments', () => ({
  useSchedulerEnrollments: vi.fn(),
}));

vi.mock('@/components/schedule', () => ({
  ScheduleCalendar: ({ events, activeCourseId }: { events: unknown[]; activeCourseId?: number | null }) => {
    scheduleCalendarSpy({
      events,
      activeCourseId,
    });
    return <div data-testid="schedule-calendar" />;
  },
  SchedulerList: ({ onCourseHoverChange }: { onCourseHoverChange?: (courseId: number | null) => void }) => {
    schedulerListSpy({
      onCourseHoverChange,
    });
    return <div data-testid="scheduler-list" />;
  },
}));

const mockedUseSchedulerEnrollments = vi.mocked(useSchedulerEnrollments);

describe('Schedule', () => {
  it('renders schedule heading and description', () => {
    mockedUseSchedulerEnrollments.mockReturnValue({
      events: [
        {
          id: 'event-1',
          courseId: 1,
          title: 'Event 1',
          daysOfWeek: [1],
          startTime: '09:00',
          endTime: '10:00',
        },
      ],
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
    expect(schedulerListSpy).toHaveBeenCalledWith({
      onCourseHoverChange: expect.any(Function),
    });
    expect(scheduleCalendarSpy).toHaveBeenCalledWith({
      events: [
        {
          id: 'event-1',
          courseId: 1,
          title: 'Event 1',
          daysOfWeek: [1],
          startTime: '09:00',
          endTime: '10:00',
        },
      ],
      activeCourseId: null,
    });
  });
});
