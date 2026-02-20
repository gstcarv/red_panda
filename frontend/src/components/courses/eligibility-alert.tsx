import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCheckEnrollmentEligibility } from '@/hooks/enrollments/use-check-enrollment-eligibility';
import { useCheckCourseStatus } from '@/hooks/courses/use-check-course-status';
import type { Course } from '@/types/course.type';
import { EligibilityErrorMessage } from './eligibility-error-message';

interface EligibilityAlertProps {
  course: Course;
}

export function EligibilityAlert({ course }: EligibilityAlertProps) {
  const { evaluate } = useCheckEnrollmentEligibility();
  const { eligible, validation } = evaluate(course);
  const { status } = useCheckCourseStatus(course);

  // Don't show alert if already enrolled, eligible, or no validation errors
  if (status === 'enrolled' || eligible || !validation || validation.length === 0) {
    return null;
  }

  return (
    <Alert variant="warning" className="border-0 w-full mt-3">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="mb-2">No sections available for enrollment</AlertTitle>
      <AlertDescription>
        <EligibilityErrorMessage error={validation[0]} />
      </AlertDescription>
    </Alert>
  );
}
