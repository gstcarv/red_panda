import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SchedulerList } from '@/components/schedule/scheduler-list';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';

vi.mock('@/components/courses/course-student-status-tag', () => ({
  CourseStudentStatusTag: () => null,
}));

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);
const enrollmentActionButtonSpy = vi.fn();

vi.mock('@/components/courses/enrollment-action-button', () => ({
  EnrollmentActionButton: (props: { courseId: number | null; sectionId: number }) => {
    enrollmentActionButtonSpy(props);
    return <button type="button">unenroll-action</button>;
  },
}));

function createEnrollment(overrides: Record<string, unknown> = {}) {
  return {
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
      teacher: { id: 1, name: 'Teacher A' },
      meetingTimes: [],
      capacity: 30,
      enrolledCount: 20,
    },
    ...overrides,
  };
}

describe('SchedulerList', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state while enrollments are unavailable', () => {
    mockedUseEnrollments.mockReturnValue({
      data: undefined,
    } as never);

    render(<SchedulerList />);

    expect(screen.getByText('Loading enrolled courses...')).toBeInTheDocument();
  });

  it('renders empty state when no enrollment exists', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [],
        },
      },
    } as never);

    render(<SchedulerList />);

    expect(screen.getByText('No enrolled courses yet.')).toBeInTheDocument();
  });

  it('renders one card per enrolled course', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [
            createEnrollment({
              id: 'enroll-1',
              course: {
                id: 1,
                code: 'MATH101',
                name: 'Algebra I',
                credits: 3,
                hoursPerWeek: 4,
                gradeLevel: { min: 9, max: 10 },
              },
            }),
            createEnrollment({
              id: 'enroll-2',
              course: {
                id: 2,
                code: 'CHEM101',
                name: 'Chemistry',
                credits: 3,
                hoursPerWeek: 4,
                gradeLevel: { min: 9, max: 11 },
              },
            }),
          ],
        },
      },
    } as never);

    render(
      <SchedulerList />,
    );

    expect(screen.getAllByTestId('schedule-course-card')).toHaveLength(2);
    expect(screen.getByText('Algebra I')).toBeInTheDocument();
    expect(screen.getByText('Chemistry')).toBeInTheDocument();
  });

  it('emits hover changes for course cards', () => {
    const onCourseHoverChange = vi.fn();
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [createEnrollment()],
        },
      },
    } as never);

    render(
      <SchedulerList onCourseHoverChange={onCourseHoverChange} />,
    );

    const card = screen.getByTestId('schedule-course-card');
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);

    expect(onCourseHoverChange).toHaveBeenNthCalledWith(1, 1);
    expect(onCourseHoverChange).toHaveBeenNthCalledWith(2, null);
  });

  it('passes course and section IDs to EnrollmentActionButton', () => {
    enrollmentActionButtonSpy.mockClear();

    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [createEnrollment()],
        },
      },
    } as never);

    render(<SchedulerList />);

    expect(enrollmentActionButtonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        courseId: 1,
        sectionId: 10,
      }),
    );
  });
});
