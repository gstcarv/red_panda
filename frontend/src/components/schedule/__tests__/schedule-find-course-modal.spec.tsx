import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScheduleFindCourseModal } from '@/components/schedule/schedule-find-course-modal';
import { useSchedulerSlotCourses } from '@/hooks/schedule/use-scheduler-slot-courses';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

vi.mock('@/hooks/schedule/use-scheduler-slot-courses', () => ({
  useSchedulerSlotCourses: vi.fn(),
  buildSlotKey: (weekDay: string, startTime: string) =>
    `${weekDay.trim().toLowerCase()}|${startTime}`,
}));

const courseSectionModalSpy = vi.fn();

vi.mock('@/components/courses/course-details-modal', () => ({
  CourseDetailsModal: (props: { courseId: number | null; open: boolean }) => {
    courseSectionModalSpy(props);
    return (
      <div data-testid="course-section-modal">
        course:{props.courseId ?? 'none'}-open:{props.open ? 'yes' : 'no'}
      </div>
    );
  },
}));

vi.mock('@/components/courses/course-student-status-tag', () => ({
  CourseStudentStatusTag: ({ course }: { course: { prerequisite?: unknown } }) => (
    <span>{course.prerequisite ? 'Not eligible' : 'Eligible'}</span>
  ),
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

const mockedUseSchedulerSlotCourses = vi.mocked(useSchedulerSlotCourses);
const mockedUseEnrollments = vi.mocked(useEnrollments);
const MONDAY_11 = 'monday|11:00';

describe('ScheduleFindCourseModal', () => {
  function setupEnrollmentsMock(courseIds: number[] = []) {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: courseIds.map((courseId) => ({
            id: String(courseId),
            course: {
              id: courseId,
              code: `C-${courseId}`,
              name: `Course ${courseId}`,
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 12 },
            },
            courseSection: {
              id: courseId * 10,
              teacher: { id: 1, name: 'Teacher' },
              meetingTimes: [],
              capacity: 30,
              enrolledCount: 10,
            },
          })),
        },
      },
    } as never);
  }

  it('shows loading state', () => {
    courseSectionModalSpy.mockClear();
    setupEnrollmentsMock();
    mockedUseSchedulerSlotCourses.mockReturnValue({
      coursesBySlot: new Map(),
      isLoading: true,
      isError: false,
    } as never);

    render(
      <ScheduleFindCourseModal
        open
        slot={{
          weekDay: 'monday',
          startTime: '11:00',
          dateLabel: 'Monday, 11:00 AM',
        }}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Find courses for this slot')).toBeInTheDocument();
  });

  it('shows empty state when no courses are available', () => {
    courseSectionModalSpy.mockClear();
    setupEnrollmentsMock();
    mockedUseSchedulerSlotCourses.mockReturnValue({
      coursesBySlot: new Map([[MONDAY_11, []]]),
      isLoading: false,
      isError: false,
    } as never);

    render(
      <ScheduleFindCourseModal
        open
        slot={{
          weekDay: 'monday',
          startTime: '11:00',
          dateLabel: 'Monday, 11:00 AM',
        }}
        onOpenChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText('No available courses found for this day and time.'),
    ).toBeInTheDocument();
  });

  it('shows available courses only', () => {
    courseSectionModalSpy.mockClear();
    setupEnrollmentsMock();
    mockedUseSchedulerSlotCourses.mockReturnValue({
      coursesBySlot: new Map([
        [
          MONDAY_11,
          [
            {
              id: 1,
              code: 'MATH101',
              name: 'Algebra I',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 10 },
              availableSections: [
                {
                  id: 101,
                  teacher: { id: 1, name: 'Dr. Smith' },
                  meetingTimes: [],
                  capacity: 30,
                  enrolledCount: 10,
                },
              ],
            },
          ],
        ],
      ]),
      isLoading: false,
      isError: false,
    } as never);

    render(
      <ScheduleFindCourseModal
        open
        slot={{
          weekDay: 'monday',
          startTime: '11:00',
          dateLabel: 'Monday, 11:00 AM',
        }}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Algebra I')).toBeInTheDocument();
    expect(screen.getByText('MATH101')).toBeInTheDocument();
    expect(screen.getByText('Eligible')).toBeInTheDocument();
    expect(screen.queryByTestId('course-section-list')).not.toBeInTheDocument();
  });

  it('opens course details modal when clicking a course', () => {
    courseSectionModalSpy.mockClear();
    setupEnrollmentsMock();
    mockedUseSchedulerSlotCourses.mockReturnValue({
      coursesBySlot: new Map([
        [
          MONDAY_11,
          [
            {
              id: 1,
              code: 'MATH101',
              name: 'Algebra I',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 10 },
              availableSections: [
                {
                  id: 101,
                  teacher: { id: 1, name: 'Dr. Smith' },
                  meetingTimes: [],
                  capacity: 30,
                  enrolledCount: 10,
                },
              ],
            },
          ],
        ],
      ]),
      isLoading: false,
      isError: false,
    } as never);

    const onOpenChange = vi.fn();
    render(
      <ScheduleFindCourseModal
        open
        slot={{
          weekDay: 'monday',
          startTime: '11:00',
          dateLabel: 'Monday, 11:00 AM',
        }}
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /algebra i/i }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByTestId('course-section-modal')).toHaveTextContent('course:1-open:yes');
  });

  it('shows not eligible when prerequisite is not enrolled', () => {
    courseSectionModalSpy.mockClear();
    setupEnrollmentsMock([]);
    mockedUseSchedulerSlotCourses.mockReturnValue({
      coursesBySlot: new Map([
        [
          MONDAY_11,
          [
            {
              id: 3,
              code: 'CS201',
              name: 'Data Structures',
              credits: 4,
              hoursPerWeek: 5,
              prerequisite: {
                id: 2,
                code: 'CS101',
                name: 'Intro to Programming',
              },
              gradeLevel: { min: 10, max: 12 },
              availableSections: [],
            },
          ],
        ],
      ]),
      isLoading: false,
      isError: false,
    } as never);

    render(
      <ScheduleFindCourseModal
        open
        slot={{
          weekDay: 'monday',
          startTime: '11:00',
          dateLabel: 'Monday, 11:00 AM',
        }}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Not eligible')).toBeInTheDocument();
  });
});
