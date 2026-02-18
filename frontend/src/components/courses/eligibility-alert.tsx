import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCheckCourseEligibility } from '@/hooks/courses/use-check-course-eligibility';
import { useCheckCourseEnrolled } from '@/hooks/courses/use-check-course-enrolled';
import type { Course } from '@/types/course.type';
import { EligibilityErrorMessage } from './eligibility-error-message';

interface EligibilityAlertProps {
  course: Course;
}

export function EligibilityAlert({ course }: EligibilityAlertProps) {
  const { eligible, validation } = useCheckCourseEligibility(course);
  const { isEnrolled } = useCheckCourseEnrolled(course);

  // Don't show alert if already enrolled, eligible, or no validation errors
  if (isEnrolled || eligible || !validation || validation.length === 0) {
    return null;
  }

  return (
    <Alert variant="warning" className="border-0 w-full mt-3">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="mb-2">No sections available for enrollment</AlertTitle>
      <AlertDescription>
        <div className="space-y-1.5">
          {validation.map((error, index) => (
            <div key={`${error.type}-${index}`}>
              <EligibilityErrorMessage error={error} />
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}
