import { CheckCircle2, XCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCheckCourseEligibility } from '@/hooks/courses/use-check-course-eligibility';
import { useCheckCourseEnrolled } from '@/hooks/courses/use-check-course-enrolled';
import { cn } from '@/lib/utils';
import type { Course } from '@/types/course.type';

interface EligibilityTagProps {
  course: Course;
}

export function EligibilityTag({ course }: EligibilityTagProps) {
  const { eligible, validation } = useCheckCourseEligibility(course);
  const { isEnrolled } = useCheckCourseEnrolled(course);

  // Show "Enrolled" badge if user is already enrolled
  if (isEnrolled) {
    const enrolledBadge = (
      <Badge
        variant="default"
        className="shrink-0 gap-1 bg-green-600 hover:bg-green-700 text-white"
        aria-label="Enrolled"
      >
        <CheckCircle className="size-3" aria-hidden />
        Enrolled
      </Badge>
    );

    return enrolledBadge;
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
    const errorMessages = validation.map((error) => error.message).join('\n');

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <div className="whitespace-pre-line">{errorMessages}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
