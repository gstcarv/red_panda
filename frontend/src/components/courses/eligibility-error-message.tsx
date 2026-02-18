import type { ReactNode } from 'react';
import type { CourseAvailabilityError } from '@/types/course.type';
import { PrerequisiteLink } from './prerequisite-link';

type EligibilityErrorMessageProps = {
  error: CourseAvailabilityError;
  onCourseSelect?: (courseId: number) => void;
  className?: string;
};

export function EligibilityErrorMessage({
  error,
  onCourseSelect,
  className,
}: EligibilityErrorMessageProps): ReactNode {
  if (error.type === 'prerequisite' && error.prerequisite) {
    return (
      <span className={className}>
        Missing prerequisite:{' '}
        <PrerequisiteLink
          prerequisite={error.prerequisite}
          onCourseSelect={onCourseSelect}
        />
      </span>
    );
  }

  return <span className={className}>{error.message}</span>;
}

