import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SchedulerList } from '@/components/schedule/scheduler-list';

describe('SchedulerList', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state while enrollments are unavailable', () => {
    render(<SchedulerList enrolledCourses={[]} isLoading />);

    expect(screen.getByText('Loading enrolled courses...')).toBeInTheDocument();
  });

  it('renders empty state when no enrollment exists', () => {
    render(<SchedulerList enrolledCourses={[]} />);

    expect(screen.getByText('No enrolled courses yet.')).toBeInTheDocument();
  });

  it('renders one card per enrolled course', () => {
    render(
      <SchedulerList
        enrolledCourses={[
          {
            enrollmentId: 'enroll-1',
            course: {
              id: 1,
              code: 'MATH101',
              name: 'Algebra I',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 10 },
            },
          },
          {
            enrollmentId: 'enroll-2',
            course: {
              id: 2,
              code: 'CHEM101',
              name: 'Chemistry',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 11 },
            },
          },
        ]}
      />,
    );

    expect(screen.getAllByTestId('schedule-course-card')).toHaveLength(2);
    expect(screen.getByText('Algebra I')).toBeInTheDocument();
    expect(screen.getByText('Chemistry')).toBeInTheDocument();
  });

  it('emits hover changes for course cards', () => {
    const onCourseHoverChange = vi.fn();

    render(
      <SchedulerList
        enrolledCourses={[
          {
            enrollmentId: 'enroll-1',
            course: {
              id: 1,
              code: 'MATH101',
              name: 'Algebra I',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 10 },
            },
          },
        ]}
        onCourseHoverChange={onCourseHoverChange}
      />,
    );

    const card = screen.getByTestId('schedule-course-card');
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);

    expect(onCourseHoverChange).toHaveBeenNthCalledWith(1, 1);
    expect(onCourseHoverChange).toHaveBeenNthCalledWith(2, null);
  });

  it('triggers unenroll when clicking course card action', () => {
    const onUnenroll = vi.fn();
    render(
      <SchedulerList
        enrolledCourses={[
          {
            enrollmentId: 'enroll-1',
            course: {
              id: 1,
              code: 'MATH101',
              name: 'Algebra I',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 10 },
            },
          },
        ]}
        onUnenroll={onUnenroll}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Unenroll' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm unenroll' }));

    expect(onUnenroll).toHaveBeenCalledWith('enroll-1');
  });

  it('does not unenroll when canceling confirmation dialog', () => {
    const onUnenroll = vi.fn();
    render(
      <SchedulerList
        enrolledCourses={[
          {
            enrollmentId: 'enroll-1',
            course: {
              id: 1,
              code: 'MATH101',
              name: 'Algebra I',
              credits: 3,
              hoursPerWeek: 4,
              gradeLevel: { min: 9, max: 10 },
            },
          },
        ]}
        onUnenroll={onUnenroll}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Unenroll' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onUnenroll).not.toHaveBeenCalled();
  });
});
