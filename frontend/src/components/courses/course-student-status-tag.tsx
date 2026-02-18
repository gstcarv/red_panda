import { CheckCircle2, XCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCheckCourseEligibility } from '@/hooks/courses/use-check-course-eligibility';
import {
  useCheckCourseStatus,
  type CourseStudentStatus,
} from '@/hooks/courses/use-check-course-status';
import { cn } from '@/lib/utils';
import type { Course } from '@/types/course.type';
import { EligibilityErrorMessage } from './eligibility-error-message';

interface CourseStudentStatusTagProps {
  course: Course;
}

function getStatusBadgeProps(status: CourseStudentStatus) {
  switch (status) {
    case 'enrolled':
      return {
        className: 'bg-purple-600 hover:bg-purple-700 text-white',
        icon: CheckCircle,
        label: 'Enrolled',
      } as const;
    case 'passed':
      return {
        className: 'bg-green-600 hover:bg-green-700 text-white',
        icon: CheckCircle2,
        label: 'Passed',
      } as const;
    case 'failed':
      return {
        className: 'bg-red-600 hover:bg-red-700 text-white',
        icon: XCircle,
        label: 'Failed',
      } as const;
  }
}

export function CourseStudentStatusTag({ course }: CourseStudentStatusTagProps) {
  const { evaluate } = useCheckCourseEligibility();
  const { eligible, validation } = evaluate(course);
  const { status } = useCheckCourseStatus(course);

  if (status) {
    const { className, icon: Icon, label } = getStatusBadgeProps(status);
    return (
      <Badge
        variant="default"
        className={cn('shrink-0 gap-1', className)}
        aria-label={label}
      >
        <Icon className="size-3" aria-hidden />
        {label}
      </Badge>
    );
  }

  const badge = (
    <Badge
      variant={eligible ? 'default' : 'secondary'}
      className={cn(
        'shrink-0 gap-1',
        !eligible && 'bg-muted text-muted-foreground',
      )}
      aria-label={eligible ? 'Eligible' : 'Not eligible'}
    >
      {eligible ? (
        <CheckCircle2 className="size-3" aria-hidden />
      ) : (
        <XCircle className="size-3" aria-hidden />
      )}
      {eligible ? 'Eligible' : 'Not eligible'}
    </Badge>
  );

  if (!eligible && validation && validation.length > 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <EligibilityErrorMessage error={validation[0]} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

