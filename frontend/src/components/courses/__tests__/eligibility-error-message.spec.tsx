import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { EligibilityErrorMessage } from '@/components/courses/eligibility-error-message';
import type { CourseAvailabilityError, CoursePrerequisite } from '@/types/course.type';

type PrerequisiteLinkProps = {
  prerequisite: CoursePrerequisite;
  onCourseSelect?: (courseId: number) => void;
};

const prerequisiteLinkSpy = mockFn<(props: PrerequisiteLinkProps) => void>();

vi.mock('@/components/courses/prerequisite-link', () => ({
  PrerequisiteLink: (props: PrerequisiteLinkProps) => {
    prerequisiteLinkSpy(props);
    return <span data-testid="prerequisite-link">{props.prerequisite.code}</span>;
  },
}));

describe('EligibilityErrorMessage', () => {
  it('renders prerequisite link when error type is prerequisite', () => {
    prerequisiteLinkSpy.mockReset();
    const onCourseSelect = mockFn<(courseId: number) => void>();
    const prerequisite: CoursePrerequisite = {
      id: 42,
      code: 'MATH101',
      name: 'Algebra I',
    };
    const error: CourseAvailabilityError = {
      type: 'prerequisite',
      message: 'Missing prerequisite',
      prerequisite,
    };

    render(<EligibilityErrorMessage error={error} onCourseSelect={onCourseSelect} />);

    expect(screen.getByText('Missing prerequisite:')).toBeInTheDocument();

    expect(screen.getByTestId('prerequisite-link')).toBeInTheDocument();
    expect(prerequisiteLinkSpy).toHaveBeenCalledWith({
      prerequisite,
      onCourseSelect,
    });
  });

  it('renders plain error message when error is not prerequisite', () => {
    prerequisiteLinkSpy.mockReset();
    const error: CourseAvailabilityError = {
      type: 'conflict',
      message: 'This course conflicts with your current schedule',
    };

    render(<EligibilityErrorMessage error={error} className="text-xs" />);

    expect(
      screen.getByText('This course conflicts with your current schedule'),
    ).toBeInTheDocument();

    expect(screen.queryByTestId('prerequisite-link')).not.toBeInTheDocument();
    expect(prerequisiteLinkSpy).not.toHaveBeenCalled();
  });
});
