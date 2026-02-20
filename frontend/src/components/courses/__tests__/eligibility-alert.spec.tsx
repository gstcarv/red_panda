import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { EligibilityAlert } from '@/components/courses/eligibility-alert';
import type { Course } from '@/types/course.type';

const useCheckEnrollmentEligibilitySpy = mockFn<
  () => {
    evaluate: () => {
      eligible: boolean;
      validation?: Array<{ type: 'conflict' | 'grade_level' | 'max_courses' | 'prerequisite' | 'other'; message: string; prerequisite?: unknown }>;
    };
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

vi.mock('@/hooks/enrollments/use-check-enrollment-eligibility', () => ({
  useCheckEnrollmentEligibility: () => useCheckEnrollmentEligibilitySpy(),
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
    useCheckEnrollmentEligibilitySpy.mockReturnValue({
      evaluate: () => ({
        eligible: false,
        validation: [{ type: 'conflict', message: 'Schedule conflict' }],
      }),
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
    useCheckEnrollmentEligibilitySpy.mockReturnValue({
      evaluate: () => ({
        eligible: false,
        validation: [{ type: 'conflict', message: 'This course conflicts with your current schedule' }],
      }),
    });

    render(<EligibilityAlert course={createCourse()} />);

    expect(
      screen.getByText('No sections available for enrollment'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('This course conflicts with your current schedule'),
    ).toBeInTheDocument();
  });

  it('renders only the first validation message', () => {
    useCheckCourseStatusSpy.mockReturnValue({
      status: undefined,
      enrolledSections: [],
      isLoading: false,
      isError: false,
    });
    useCheckEnrollmentEligibilitySpy.mockReturnValue({
      evaluate: () => ({
        eligible: false,
        validation: [
          {
            type: 'max_courses',
            message: 'You have reached the maximum limit of 5 enrollments',
          },
          {
            type: 'conflict',
            message: 'This course conflicts with your current schedule',
          },
        ],
      }),
    });

    render(<EligibilityAlert course={createCourse()} />);

    expect(
      screen.getByText('You have reached the maximum limit of 5 enrollments'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('This course conflicts with your current schedule'),
    ).not.toBeInTheDocument();
  });
});
