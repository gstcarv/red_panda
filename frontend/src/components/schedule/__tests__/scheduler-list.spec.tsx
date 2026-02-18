import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SchedulerList } from '@/components/schedule/scheduler-list';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);

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
            {
              id: 'enroll-2',
              course: {
                id: 2,
                code: 'CHEM101',
                name: 'Chemistry',
                credits: 3,
                hoursPerWeek: 4,
                gradeLevel: { min: 9, max: 11 },
              },
              courseSection: {
                id: 11,
                teacher: {
                  id: 2,
                  name: 'Teacher B',
                },
                meetingTimes: [],
                capacity: 30,
                enrolledCount: 15,
              },
            },
          ],
        },
      },
    } as never);

    render(<SchedulerList />);

    expect(screen.getAllByTestId('schedule-course-card')).toHaveLength(2);
    expect(screen.getByText('Algebra I')).toBeInTheDocument();
    expect(screen.getByText('Chemistry')).toBeInTheDocument();
  });

  it('emits hover changes for course cards', () => {
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
    const onCourseHoverChange = vi.fn();

    render(<SchedulerList onCourseHoverChange={onCourseHoverChange} />);

    const card = screen.getByTestId('schedule-course-card');
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);

    expect(onCourseHoverChange).toHaveBeenNthCalledWith(1, 1);
    expect(onCourseHoverChange).toHaveBeenNthCalledWith(2, null);
  });
});
