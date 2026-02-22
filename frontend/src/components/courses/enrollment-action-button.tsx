import { useState } from 'react';
import { CheckCircle2, LogOut, Plus, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEnroll } from '@/hooks/enrollments/use-enroll';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useUnenroll } from '@/hooks/enrollments/use-unenroll';
import { useCourseHistory } from '@/hooks/courses/use-course-history';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FeedbackDialog } from '@/components/ui/feedback-dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { EnrollmentAvailabilityError } from '@/types/enrollments.type';
import { EligibilityErrorMessage } from './eligibility-error-message';

type EnrollmentActionButtonProps = {
  courseId: number | null;
  sectionId: number;
  isFull?: boolean;
  eligible?: boolean;
  validation?: EnrollmentAvailabilityError[];
  onEnrollSuccess?: () => void;
  onUnenrollSuccess?: () => void;
  onError?: (error: unknown) => void;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmButtonLabel?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
};

export function EnrollmentActionButton({
  courseId,
  sectionId,
  isFull = false,
  eligible = true,
  validation,
  onEnrollSuccess,
  onUnenrollSuccess,
  onError,
  confirmTitle = 'Unenroll from section?',
  confirmDescription = 'This action will remove your enrollment from this section.',
  confirmButtonLabel = 'Confirm unenroll',
  className,
  size = 'sm',
}: EnrollmentActionButtonProps) {
  const { notifyError } = useErrorHandler();
  const { data: enrollmentsResponse } = useEnrollments();
  const { data: courseHistoryResponse } = useCourseHistory();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: '',
    description: '',
  });
  const enrollments = enrollmentsResponse?.enrollments ?? [];
  const enrollment = enrollments.find(
    (value) => value.courseSection.id === sectionId,
  );
  const isEnrolled = Boolean(enrollment);
  const courseHistory = courseHistoryResponse?.courseHistory ?? [];
  const isPassed =
    courseId != null &&
    Boolean(
      courseHistory.find(
        (h) => h.courseId === courseId && h.status === 'passed',
      ),
    );

  const enrollMutation = useEnroll(courseId, {
    onSuccess: () => {
      setSuccessFeedback({
        open: true,
        title: 'Enrollment Successful!',
        description: 'You have been enrolled in this section.',
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error);
        return;
      }

      notifyError(error, 'Failed to enroll. Please try again.');
    },
  });

  const unenrollMutation = useUnenroll({
    onSuccess: () => {
      onUnenrollSuccess?.();
    },
    onError: (error) => {
      if (onError) {
        onError(error);
        return;
      }

      notifyError(error, 'Failed to unenroll. Please try again.');
    },
  });

  const isPending = enrollMutation.isPending || unenrollMutation.isPending;

  if (isPassed) {
    return (
      <Button
        type="button"
        variant="outline"
        size={size}
        className={className}
        disabled
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-600" />
        Passed
      </Button>
    );
  }

  if (isEnrolled) {
    if (!enrollment) {
      return (
        <Button
          type="button"
          variant="outline"
          size={size}
          className={className}
          disabled
        >
          Enrolled
        </Button>
      );
    }

    return (
      <>
        <Button
          type="button"
          variant="outline"
          size={size}
          className={className}
          onClick={() => setIsConfirmOpen(true)}
          disabled={isPending}
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          {isPending ? 'Unenrolling...' : 'Unenroll'}
        </Button>
        <ConfirmationDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title={confirmTitle}
          description={confirmDescription}
          onConfirm={() => {
            unenrollMutation.mutate(enrollment.course.id);
            setIsConfirmOpen(false);
          }}
          confirmLabel={isPending ? 'Unenrolling...' : confirmButtonLabel}
          confirmDisabled={isPending}
          cancelDisabled={isPending}
          confirmIcon={<LogOut className="size-4 mr-1.5" aria-hidden />}
        />
        <FeedbackDialog
          open={successFeedback.open}
          onOpenChange={(open) => {
            if (!open && successFeedback.open) {
              onEnrollSuccess?.();
            }
            setSuccessFeedback((current) => ({
              ...current,
              open,
            }));
          }}
          variant="success"
          title={successFeedback.title}
          description={successFeedback.description}
        />
      </>
    );
  }

  const isDisabled = isFull || isPending || !courseId;
  const hasValidationErrors = Boolean(!eligible && validation && validation.length > 0);

  const button = (
    <Button
      type="button"
      variant={eligible ? 'default' : 'secondary'}
      size={size}
      className={className}
      onClick={() => {
        if (!courseId || !eligible || isDisabled) {
          return;
        }

        enrollMutation.mutate(sectionId);
      }}
      disabled={isDisabled || !eligible}
      aria-disabled={!eligible}
    >
      {eligible ? (
        <Plus className="h-3.5 w-3.5 mr-1.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5 mr-1.5" />
      )}
      {!eligible
        ? 'Not eligible for enrollment'
        : isPending
          ? 'Enrolling...'
          : isFull
            ? 'Full'
            : 'Enroll'}
    </Button>
  );

  if (hasValidationErrors && validation) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="inline-flex">
              {button}
            </TooltipTrigger>
            <TooltipContent>
              {validation && validation.length > 0 && (
                <EligibilityErrorMessage error={validation[0]} />
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <FeedbackDialog
          open={successFeedback.open}
          onOpenChange={(open) => {
            if (!open && successFeedback.open) {
              onEnrollSuccess?.();
            }
            setSuccessFeedback((current) => ({
              ...current,
              open,
            }));
          }}
          variant="success"
          title={successFeedback.title}
          description={successFeedback.description}
        />
      </>
    );
  }

  return (
    <>
      {button}
      <FeedbackDialog
        open={successFeedback.open}
        onOpenChange={(open) => {
          if (!open && successFeedback.open) {
            onEnrollSuccess?.();
          }
          setSuccessFeedback((current) => ({
            ...current,
            open,
          }));
        }}
        variant="success"
        title={successFeedback.title}
        description={successFeedback.description}
      />
    </>
  );
}
