import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { CourseStudentStatusTag } from '@/components/courses/course-student-status-tag';
import type { Course } from '@/types/course.type';
import type { EnrollmentAvailabilityError } from '@/types/enrollments.type';

type EligibilityResult = {
  eligible: boolean;
  validation?: EnrollmentAvailabilityError[];
};

const useCheckCourseEligibilitySpy = mockFn<
  () => {
    evaluate: (course: Course) => EligibilityResult;
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

const eligibilityErrorMessageSpy = mockFn<
  (props: { error: EnrollmentAvailabilityError }) => void
>();

vi.mock('@/hooks/enrollments/use-check-enrollment-eligibility', () => ({
  useCheckEnrollmentEligibility: () => useCheckCourseEligibilitySpy(),
}));

vi.mock('@/hooks/courses/use-check-course-status', () => ({
  useCheckCourseStatus: () => useCheckCourseStatusSpy(),
}));

vi.mock('@/components/courses/eligibility-error-message', () => ({
  EligibilityErrorMessage: (props: { error: EnrollmentAvailabilityError }) => {
    eligibilityErrorMessageSpy(props);
    return <span data-testid="eligibility-error-message">{props.error.message}</span>;
  },
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
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

describe('CourseStudentStatusTag', () => {
  it('renders provided status without evaluating hooks', () => {
    useCheckCourseStatusSpy.mockReset();
    useCheckCourseEligibilitySpy.mockReset();

    render(<CourseStudentStatusTag status="failed" />);

    expect(screen.getByLabelText('Failed')).toBeInTheDocument();
    expect(useCheckCourseStatusSpy).not.toHaveBeenCalled();
    expect(useCheckCourseEligibilitySpy).not.toHaveBeenCalled();
  });

  it('prioritizes student status over eligibility result', () => {
    useCheckCourseStatusSpy.mockReturnValue({
      status: 'passed',
      enrolledSections: [],
      isLoading: false,
      isError: false,
    });
    useCheckCourseEligibilitySpy.mockReturnValue({
      evaluate: () => ({
        eligible: false,
        validation: [{ type: 'conflict', message: 'Schedule conflict' }],
      }),
    });

    render(<CourseStudentStatusTag course={createCourse()} />);

    expect(screen.getByLabelText('Passed')).toBeInTheDocument();

    expect(screen.queryByLabelText('Not eligible')).not.toBeInTheDocument();
    expect(screen.queryByTestId('eligibility-error-message')).not.toBeInTheDocument();
  });

  it('renders eligible badge when course is eligible and has no status', () => {
    useCheckCourseStatusSpy.mockReturnValue({
      status: undefined,
      enrolledSections: [],
      isLoading: false,
      isError: false,
    });
    useCheckCourseEligibilitySpy.mockReturnValue({
      evaluate: () => ({ eligible: true, validation: [] }),
    });

    render(<CourseStudentStatusTag course={createCourse()} />);

    expect(screen.getByLabelText('Eligible')).toBeInTheDocument();
    expect(screen.queryByLabelText('Not eligible')).not.toBeInTheDocument();
  });

  it('shows first validation reason in tooltip content when not eligible', () => {
    eligibilityErrorMessageSpy.mockReset();
    const firstError: EnrollmentAvailabilityError = {
      type: 'max_courses',
      message: 'You have reached the maximum limit',
    };
    const secondError: EnrollmentAvailabilityError = {
      type: 'conflict',
      message: 'Schedule conflict',
    };

    useCheckCourseStatusSpy.mockReturnValue({
      status: undefined,
      enrolledSections: [],
      isLoading: false,
      isError: false,
    });
    useCheckCourseEligibilitySpy.mockReturnValue({
      evaluate: () => ({
        eligible: false,
        validation: [firstError, secondError],
      }),
    });

    render(<CourseStudentStatusTag course={createCourse()} />);

    expect(screen.getByLabelText('Not eligible')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();

    expect(screen.getByTestId('eligibility-error-message')).toHaveTextContent(
      'You have reached the maximum limit',
    );
    expect(screen.queryByText('Schedule conflict')).not.toBeInTheDocument();

    expect(eligibilityErrorMessageSpy).toHaveBeenCalledWith({ error: firstError });
  });
});
