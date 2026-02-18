import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CourseSectionList } from '@/components/courses/course-section-list';
import type { CourseSection } from '@/types/course.type';

function createSection(overrides: Partial<CourseSection> = {}): CourseSection {
  return {
    id: 10,
    teacher: {
      id: 100,
      name: 'Jane Doe',
    },
    meetingTimes: [
      {
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '09:30',
      },
    ],
    capacity: 30,
    enrolledCount: 12,
    ...overrides,
  };
}

const enrollmentActionButtonSpy = vi.fn();

vi.mock('@/components/courses/enrollment-action-button', () => ({
  EnrollmentActionButton: (props: {
    courseId: number | null;
    sectionId: number;
    isFull?: boolean;
  }) => {
    enrollmentActionButtonSpy(props);
    return <button type="button">action-{props.sectionId}-{props.isFull ? 'full' : 'open'}</button>;
  },
}));

describe('CourseSectionList', () => {
  it('renders section schedule and enrollment status', () => {
    render(<CourseSectionList courseId={1} sections={[createSection()]} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Mon 8:00 AM-9:30 AM')).toBeInTheDocument();
    expect(screen.getByText('18 spots')).toBeInTheDocument();
  });

  it('shows an empty state when no sections are available', () => {
    render(<CourseSectionList courseId={1} sections={[]} />);

    expect(
      screen.getByText('No sections available for this course.'),
    ).toBeInTheDocument();
  });

  it('passes course/section identifiers to EnrollmentActionButton', () => {
    enrollmentActionButtonSpy.mockClear();

    render(<CourseSectionList courseId={7} sections={[createSection({ id: 9 })]} />);

    expect(enrollmentActionButtonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        courseId: 7,
        sectionId: 9,
      }),
    );
  });

  it('marks full sections in action props and badge', () => {
    enrollmentActionButtonSpy.mockClear();
    render(
      <CourseSectionList
        courseId={1}
        sections={[createSection({ capacity: 20, enrolledCount: 20 })]}
      />,
    );

    expect(screen.getAllByText('Full')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'action-10-full' })).toBeInTheDocument();
    expect(enrollmentActionButtonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionId: 10,
        isFull: true,
      }),
    );
  });
});
