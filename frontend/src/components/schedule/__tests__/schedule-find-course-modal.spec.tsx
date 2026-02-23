import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScheduleFindCourseModal } from '@/components/schedule/schedule-find-course-modal';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useScheduleFindCourseModal } from '@/hooks/schedule/use-schedule-find-course-modal';

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

vi.mock('@/hooks/schedule/use-scheduler-slot-courses', () => ({
  useSchedulerSlotCourses: vi.fn(),
  buildSlotKey: (weekDay: string, startTime: string) =>
    `${weekDay.trim().toLowerCase()}|${startTime}`,
}));

vi.mock('@/hooks/schedule/use-schedule-find-course-modal', () => ({
  useScheduleFindCourseModal: vi.fn(),
}));

vi.mock('@/hooks/semester/use-active-semester', () => ({
  useActiveSemester: vi.fn(() => ({ id: 1 })),
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

const mockedUseScheduleFindCourseModal = vi.mocked(useScheduleFindCourseModal);
const mockedUseEnrollments = vi.mocked(useEnrollments);

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
    mockedUseScheduleFindCourseModal.mockReturnValue({
      selectedCourseId: null,
      setSelectedCourseId: vi.fn(),
      coursesWithEligibility: [],
      isLoading: true,
      isError: false,
      handleCourseDetailsOpenChange: vi.fn(),
    });

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
    mockedUseScheduleFindCourseModal.mockReturnValue({
      selectedCourseId: null,
      setSelectedCourseId: vi.fn(),
      coursesWithEligibility: [],
      isLoading: false,
      isError: false,
      handleCourseDetailsOpenChange: vi.fn(),
    });

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
    mockedUseScheduleFindCourseModal.mockReturnValue({
      selectedCourseId: null,
      setSelectedCourseId: vi.fn(),
      coursesWithEligibility: [
        {
          course: {
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
          isEnrolled: false,
        },
      ],
      isLoading: false,
      isError: false,
      handleCourseDetailsOpenChange: vi.fn(),
    });

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
    const setSelectedCourseId = vi.fn();
    mockedUseScheduleFindCourseModal.mockReturnValue({
      selectedCourseId: null,
      setSelectedCourseId,
      coursesWithEligibility: [
        {
          course: {
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
          isEnrolled: false,
        },
      ],
      isLoading: false,
      isError: false,
      handleCourseDetailsOpenChange: vi.fn(),
    });

    const onOpenChange = vi.fn();
    const { rerender } = render(
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

    expect(setSelectedCourseId).toHaveBeenCalledWith(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    
    // Update mock to return selectedCourseId after click
    mockedUseScheduleFindCourseModal.mockReturnValue({
      selectedCourseId: 1,
      setSelectedCourseId,
      coursesWithEligibility: [
        {
          course: {
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
          isEnrolled: false,
        },
      ],
      isLoading: false,
      isError: false,
      handleCourseDetailsOpenChange: vi.fn(),
    });
    
    // Re-render to show modal
    rerender(
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

    expect(screen.getByTestId('course-section-modal')).toHaveTextContent('course:1-open:yes');
  });

  it('shows not eligible when prerequisite is not enrolled', () => {
    courseSectionModalSpy.mockClear();
    setupEnrollmentsMock([]);
    mockedUseScheduleFindCourseModal.mockReturnValue({
      selectedCourseId: null,
      setSelectedCourseId: vi.fn(),
      coursesWithEligibility: [
        {
          course: {
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
          isEnrolled: false,
        },
      ],
      isLoading: false,
      isError: false,
      handleCourseDetailsOpenChange: vi.fn(),
    });

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
