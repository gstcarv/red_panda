import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Schedule } from '@/pages/schedule';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useEnrollmentFlow } from '@/hooks/enrollments/use-enrollment-flow';
import { useSchedulerEnrollments } from '@/hooks/enrollments/use-scheduler-enrollments';

const scheduleCalendarSpy = vi.fn();
const schedulerListSpy = vi.fn();

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

vi.mock('@/hooks/enrollments/use-scheduler-enrollments', () => ({
  useSchedulerEnrollments: vi.fn(),
}));

vi.mock('@/hooks/enrollments/use-enrollment-flow', () => ({
  useEnrollmentFlow: vi.fn(),
}));

vi.mock('@/hooks/use-error-handler', () => ({
  useErrorHandler: () => ({
    notifyError: vi.fn(),
  }),
}));

vi.mock('@/components/schedule', () => ({
  ScheduleCalendar: ({
    events,
    activeCourseId,
    selectedCourseId,
    onCourseEventSelect,
    onCourseDetailsOpenChange,
    onEnrollSection,
    onUnenrollSection,
    enrollingSectionId,
    unenrollingSectionId,
    isSectionEnrolled,
  }: {
    events: unknown[];
    activeCourseId?: number | null;
    selectedCourseId?: number | null;
    onCourseEventSelect?: (courseId: number) => void;
    onCourseDetailsOpenChange?: (open: boolean) => void;
    onEnrollSection?: (sectionId: number) => void;
    onUnenrollSection?: (sectionId: number) => void;
    enrollingSectionId?: number | null;
    unenrollingSectionId?: number | null;
    isSectionEnrolled?: (sectionId: number) => boolean;
  }) => {
    scheduleCalendarSpy({
      events,
      activeCourseId,
      selectedCourseId,
      onCourseEventSelect,
      onCourseDetailsOpenChange,
      onEnrollSection,
      onUnenrollSection,
      enrollingSectionId,
      unenrollingSectionId,
      isSectionEnrolled,
    });
    return <div data-testid="schedule-calendar" />;
  },
  SchedulerList: ({
    enrolledCourses,
    isLoading,
    unenrollingEnrollmentId,
    onUnenroll,
    onCourseHoverChange,
  }: {
    enrolledCourses: unknown[];
    isLoading?: boolean;
    unenrollingEnrollmentId?: string | null;
    onUnenroll?: (enrollmentId: string) => void;
    onCourseHoverChange?: (courseId: number | null) => void;
  }) => {
    schedulerListSpy({
      enrolledCourses,
      isLoading,
      unenrollingEnrollmentId,
      onUnenroll,
      onCourseHoverChange,
    });
    return <div data-testid="scheduler-list" />;
  },
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);
const mockedUseEnrollmentFlow = vi.mocked(useEnrollmentFlow);
const mockedUseSchedulerEnrollments = vi.mocked(useSchedulerEnrollments);

describe('Schedule', () => {
  it('renders schedule heading and description', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [
            {
              id: 'enroll-1',
              course: {
                id: 1,
                code: 'MATH101',
                name: 'Algebra I',
                credits: 3,
                hoursPerWeek: 4,
                gradeLevel: { min: 9, max: 10 },
              },
              courseSection: {
                id: 10,
                teacher: {
                  id: 1,
                  name: 'Teacher A',
                },
                meetingTimes: [],
                capacity: 30,
                enrolledCount: 20,
              },
            },
          ],
        },
      },
    } as never);
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
    mockedUseEnrollmentFlow.mockReturnValue({
      enrollInSection: vi.fn(),
      unenrollFromSection: vi.fn(),
      enrollingSectionId: null,
      unenrollingSectionId: null,
      isSectionEnrolled: vi.fn(),
      isEnrollmentsLoading: false,
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
      enrolledCourses: expect.arrayContaining([
        expect.objectContaining({
          enrollmentId: 'enroll-1',
        }),
      ]),
      isLoading: false,
      unenrollingEnrollmentId: null,
      onUnenroll: expect.any(Function),
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
      selectedCourseId: null,
      onCourseEventSelect: expect.any(Function),
      onCourseDetailsOpenChange: expect.any(Function),
      onEnrollSection: expect.any(Function),
      onUnenrollSection: expect.any(Function),
      enrollingSectionId: null,
      unenrollingSectionId: null,
      isSectionEnrolled: expect.any(Function),
    });
  });
});
