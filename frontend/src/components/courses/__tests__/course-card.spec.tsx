import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { CourseCard } from '@/components/courses/course-card';
import type { Course } from '@/types/course.type';

vi.mock('@/components/courses/course-student-status-tag', () => ({
  CourseStudentStatusTag: () => <span aria-label="Eligible">Eligible</span>,
}));

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
    availableSections: [],
    ...overrides,
  };
}

describe('CourseCard', () => {
  it('renders core course information and eligibility badge', () => {
    const course = createCourse();

    render(<CourseCard course={course} eligible />);

    expect(screen.getByText('Algebra I')).toBeInTheDocument();
    expect(screen.getByText('MATH101')).toBeInTheDocument();
    expect(screen.getByLabelText('Eligible')).toBeInTheDocument();
    expect(screen.getByText('3 credits')).toBeInTheDocument();
  });

  it('calls onClick for mouse and keyboard interactions', async () => {
    const user = userEvent.setup();
    const onClick = mockFn<(courseId: number) => void>();
    const course = createCourse({ id: 21 });

    render(<CourseCard course={course} onClick={onClick} />);
    const cardButton = screen.getByRole('button');

    await user.click(cardButton);

    expect(onClick).toHaveBeenCalledWith(21);

    cardButton.focus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders optional footer action content', () => {
    const course = createCourse();

    render(
      <CourseCard
        course={course}
        footerAction={<button type="button">Unenroll</button>}
      />,
    );

    expect(screen.getByRole('button', { name: 'Unenroll' })).toBeInTheDocument();
  });
});
