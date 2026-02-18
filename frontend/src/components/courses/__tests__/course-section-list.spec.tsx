import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
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

describe('CourseSectionList', () => {
  it('shows an empty state when no sections are available', () => {
    render(<CourseSectionList sections={[]} />);

    expect(
      screen.getByText('No sections available for this course.'),
    ).toBeInTheDocument();
  });

  it('renders section schedule and enrollment status', () => {
    render(<CourseSectionList sections={[createSection()]} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Mon 8:00 AM-9:30 AM')).toBeInTheDocument();
    expect(screen.getByText('18 spots')).toBeInTheDocument();
  });

  it('calls onEnroll for available sections', async () => {
    const user = userEvent.setup();
    const onEnroll = mockFn<(sectionId: number) => void>();

    render(
      <CourseSectionList
        sections={[createSection({ id: 9 })]}
        onEnroll={onEnroll}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Enroll' }));

    expect(onEnroll).toHaveBeenCalledWith(9);
  });

  it('disables actions when section is full', () => {
    render(
      <CourseSectionList
        sections={[createSection({ capacity: 20, enrolledCount: 20 })]}
        onEnroll={mockFn<(sectionId: number) => void>()}
      />,
    );

    expect(screen.getAllByText('Full')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Full' })).toBeDisabled();
  });

  it('shows enrolling label and disables button for the enrolling section', () => {
    render(
      <CourseSectionList
        sections={[createSection({ id: 12 })]}
        onEnroll={mockFn<(sectionId: number) => void>()}
        enrollingSectionId={12}
      />,
    );

    expect(screen.getByRole('button', { name: 'Enrolling...' })).toBeDisabled();
  });

  it('shows unenroll action for enrolled sections', async () => {
    const user = userEvent.setup();
    const onUnenroll = mockFn<(sectionId: number) => void>();

    render(
      <CourseSectionList
        sections={[createSection({ id: 21 })]}
        onUnenroll={onUnenroll}
        isSectionEnrolled={() => true}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Unenroll' }));
    await user.click(screen.getByRole('button', { name: 'Confirm unenroll' }));

    expect(onUnenroll).toHaveBeenCalledWith(21);
  });
});
