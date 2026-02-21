import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScheduleCalendar } from '@/components/schedule/schedule-calendar';
import { useAvailableCoursesBySlot } from '@/hooks/courses/use-available-courses-by-slot';
import { useActiveSemester } from '@/hooks/semester/use-active-semester';

const schedulerSpy = vi.fn();
const findCourseModalSpy = vi.fn();
const courseSectionModalSpy = vi.fn();

vi.mock('@/components/ui/scheduler', () => ({
  Scheduler: (props: {
    testId?: string;
    onDateClick?: (arg: { date: Date }) => void;
    onEventClick?: (arg: { event: { extendedProps: { courseId: number } } }) => void;
  }) => {
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

vi.mock('@/components/courses/course-section-modal', () => ({
  CourseDetailsModal: (props: { courseId: number | null; open: boolean }) => {
    courseSectionModalSpy(props);
    return <div data-testid="course-section-modal" />;
  },
}));

vi.mock('@/hooks/courses/use-available-courses-by-slot', () => ({
  useAvailableCoursesBySlot: vi.fn(),
}));

vi.mock('@/hooks/semester/use-active-semester', () => ({
  useActiveSemester: vi.fn(),
}));

const mockedUseAvailableCoursesBySlot = vi.mocked(useAvailableCoursesBySlot);
const mockedUseActiveSemester = vi.mocked(useActiveSemester);

describe('ScheduleCalendar', () => {
  function setupAvailableSlots() {
    mockedUseActiveSemester.mockReturnValue({
      id: 2,
      name: 'Spring',
      year: 2025,
      order_in_year: 2,
    });
    mockedUseAvailableCoursesBySlot.mockReturnValue({
      coursesBySlot: new Map([
        [
          'monday|11:00',
          [
            {
              id: 99,
              code: 'BIO101',
              name: 'Biology',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 12 },
              availableSections: [],
            },
          ],
        ],
      ]),
    } as never);
  }

  it('renders scheduler UI component with mapped props', () => {
    schedulerSpy.mockClear();
    findCourseModalSpy.mockClear();
    courseSectionModalSpy.mockClear();
    setupAvailableSlots();

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

    expect(schedulerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ariaLabel: 'Weekly calendar',
        testId: 'schedule-calendar',
        height: expect.any(Number),
        containerRef: expect.any(Object),
        onDateClick: expect.any(Function),
        onEventClick: expect.any(Function),
      }),
    );
    expect(findCourseModalSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        open: false,
        slot: null,
      }),
    );
    expect(courseSectionModalSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        open: false,
        courseId: null,
      }),
    );

    expect(schedulerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.arrayContaining([
          expect.objectContaining({
            id: 'slot-hint-1-11:00',
            title: '1 course available',
          }),
          expect.objectContaining({
            id: 'enroll-1-101-1-09:00',
            title: 'MATH101 - Algebra I',
          }),
        ]),
      }),
    );
  });

  it('does not create hint event for occupied slots', () => {
    schedulerSpy.mockClear();
    findCourseModalSpy.mockClear();
    courseSectionModalSpy.mockClear();

    mockedUseAvailableCoursesBySlot.mockReturnValue({
      coursesBySlot: new Map([
        [
          'monday|09:00',
          [
            {
              id: 99,
              code: 'BIO101',
              name: 'Biology',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 12 },
              availableSections: [],
            },
          ],
        ],
      ]),
    } as never);

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

    const renderedEvents = schedulerSpy.mock.calls[0][0].events as Array<{ id: string }>;
    expect(renderedEvents.some((event) => event.id === 'slot-hint-1-09:00')).toBe(false);
  });

  it('opens find-course modal with selected slot on calendar click', async () => {
    schedulerSpy.mockClear();
    findCourseModalSpy.mockClear();
    courseSectionModalSpy.mockClear();
    setupAvailableSlots();

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

  it('emits selected course id when clicking calendar event', () => {
    schedulerSpy.mockClear();
    findCourseModalSpy.mockClear();
    courseSectionModalSpy.mockClear();
    setupAvailableSlots();

    render(<ScheduleCalendar events={[]} />);

    const onEventClick = schedulerSpy.mock.calls[0][0].onEventClick as (arg: {
      event: { extendedProps: { courseId: number } };
    }) => void;

    act(() => {
      onEventClick({
        event: { extendedProps: { courseId: 12 } },
      });
    });

    expect(courseSectionModalSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        courseId: 12,
        open: true,
      }),
    );
  });

  it('ignores event click when course id is invalid', () => {
    schedulerSpy.mockClear();
    findCourseModalSpy.mockClear();
    courseSectionModalSpy.mockClear();
    setupAvailableSlots();

    render(<ScheduleCalendar events={[]} />);

    const onEventClick = schedulerSpy.mock.calls[0][0].onEventClick as (arg: {
      event: { extendedProps: { courseId: number } };
    }) => void;

    act(() => {
      onEventClick({
        event: { extendedProps: { courseId: 0 } },
      });
    });

    expect(courseSectionModalSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        courseId: null,
        open: false,
      }),
    );
  });
});
