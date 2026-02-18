import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { EligibilityAlert } from '@/components/courses/eligibility-alert';
import type { Course } from '@/types/course.type';

const useCheckCourseEligibilitySpy = mockFn<
  () => {
    eligible: boolean;
    validation?: Array<{ type: 'conflict' | 'other'; message: string }>;
  }
>();

const useCheckCourseStatusSpy = mockFn<
  () => {
    status?: 'enrolled' | 'passed' | 'failed';
    enrolledSections: unknown[];
    isLoading: boolean;
    isError: boolean;
  }
>();

vi.mock('@/hooks/courses/use-check-course-eligibility', () => ({
  useCheckCourseEligibility: () => useCheckCourseEligibilitySpy(),
}));

vi.mock('@/hooks/courses/use-check-course-status', () => ({
  useCheckCourseStatus: () => useCheckCourseStatusSpy(),
}));

function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 1,
    code: 'CS101',
    name: 'Intro to Programming',
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
    ...overrides,
  };
}

describe('EligibilityAlert', () => {
  it('does not render when course is already enrolled', () => {
    useCheckCourseStatusSpy.mockReturnValue({
      status: 'enrolled',
      enrolledSections: [],
      isLoading: false,
      isError: false,
    });
    useCheckCourseEligibilitySpy.mockReturnValue({
      eligible: false,
      validation: [{ type: 'conflict', message: 'Schedule conflict' }],
    });

    render(<EligibilityAlert course={createCourse()} />);

    expect(
      screen.queryByText('No sections available for enrollment'),
    ).not.toBeInTheDocument();
  });

  it('shows warning and reasons when course cannot be enrolled', () => {
    useCheckCourseStatusSpy.mockReturnValue({
      status: undefined,
      enrolledSections: [],
      isLoading: false,
      isError: false,
    });
    useCheckCourseEligibilitySpy.mockReturnValue({
      eligible: false,
      validation: [
        { type: 'conflict', message: 'This course conflicts with your current schedule' },
        { type: 'other', message: 'No section has available seats' },
      ],
    });

    render(<EligibilityAlert course={createCourse()} />);

    expect(
      screen.getByText('No sections available for enrollment'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('This course conflicts with your current schedule'),
    ).toBeInTheDocument();
    expect(screen.getByText('No section has available seats')).toBeInTheDocument();
  });
});
