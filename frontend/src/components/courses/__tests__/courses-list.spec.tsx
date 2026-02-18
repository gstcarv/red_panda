import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { CoursesList } from '@/components/courses/courses-list';
import type { Course } from '@/types/course.type';

function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 1,
    code: 'MATH101',
    name: 'Algebra I',
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: {
      min: 9,
      max: 10,
    },
    ...overrides,
  };
}

vi.mock('@/components/courses/course-section-modal', () => ({
  CourseSectionModal: ({
    courseId,
    open,
  }: {
    courseId: number | null;
    open: boolean;
  }) => (
    <div data-testid="course-section-modal">
      {open ? `open:${courseId}` : 'closed'}
    </div>
  ),
}));

describe('CoursesList', () => {
  it('renders loading state with aria busy list', () => {
    render(<CoursesList courses={[]} isLoading />);

    expect(screen.getByLabelText('Loading courses')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('renders error state and allows retry', async () => {
    const user = userEvent.setup();
    const onRetry = mockFn<() => void>();

    render(<CoursesList courses={[]} isError onRetry={onRetry} />);

    expect(screen.getByText('Failed to load courses')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders empty state message', () => {
    render(<CoursesList courses={[]} emptyMessage="Nothing to show" />);

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('renders courses count and opens details modal on click', async () => {
    const user = userEvent.setup();
    const course = createCourse({ id: 4, name: 'Chemistry' });

    render(<CoursesList courses={[course]} />);

    expect(screen.getByText('1 course found')).toBeInTheDocument();
    expect(screen.getByTestId('course-section-modal')).toHaveTextContent('closed');

    await user.click(screen.getByRole('button'));

    expect(screen.getByTestId('course-section-modal')).toHaveTextContent('open:4');
  });
});
