import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseSectionModal } from '@/components/courses/course-section-modal';
import { useAvailableCoursesBySlot } from '@/hooks/courses/use-available-courses-by-slot';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useEnrollmentFlow } from '@/hooks/enrollments/use-enrollment-flow';
import { useErrorHandler } from '@/hooks/use-error-handler';
import type { SchedulerSlotSelection } from '@/types/scheduler.type';

type ScheduleFindCourseModalProps = {
  open: boolean;
  slot: SchedulerSlotSelection | null;
  onOpenChange: (open: boolean) => void;
};

export function ScheduleFindCourseModal({
  open,
  slot,
  onOpenChange,
}: ScheduleFindCourseModalProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { notifyError } = useErrorHandler();
  const queryParams = slot
    ? {
        weekDay: slot.weekDay,
        startTime: slot.startTime,
      }
    : null;

  const { data, isLoading, isError } = useAvailableCoursesBySlot(queryParams);
  const { data: enrollmentsResponse } = useEnrollments();
  const courses = data?.data.courses ?? [];
  const enrolledCourseIds = useMemo(() => {
    const enrollments = enrollmentsResponse?.data.enrollments ?? [];
    return new Set(enrollments.map((enrollment) => enrollment.course.id));
  }, [enrollmentsResponse]);
  const { enrollInSection, enrollingSectionId, isSectionEnrolled } =
    useEnrollmentFlow(selectedCourseId, {
      onSuccess: () => {
        setSelectedCourseId(null);
      },
      onError: (error) => {
        notifyError(error, 'Failed to enroll. Please try again.');
      },
    });

  const handleCourseClick = (courseId: number) => {
    setSelectedCourseId(courseId);
    onOpenChange(false);
  };

  const isCourseEligible = (course: (typeof courses)[number]) => {
    if (!course.prerequisite) {
      return true;
    }

    return enrolledCourseIds.has(course.prerequisite.id);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Find courses for this slot</DialogTitle>
            <DialogDescription>
              {slot
                ? `Showing courses with sections on ${slot.dateLabel}`
                : 'Select a calendar slot to find available courses.'}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load available courses for this slot.
              </AlertDescription>
            </Alert>
          ) : courses.length === 0 ? (
            <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
              No available courses found for this day and time.
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <Button
                  key={course.id}
                  type="button"
                  variant="outline"
                  className="h-auto w-full justify-between p-4"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="text-left">
                    <h3 className="text-base font-semibold">{course.name}</h3>
                    <p className="text-sm font-mono text-muted-foreground">
                      {course.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isCourseEligible(course) ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      {isCourseEligible(course) ? (
                        <CheckCircle2 className="size-3" aria-hidden />
                      ) : (
                        <XCircle className="size-3" aria-hidden />
                      )}
                      {isCourseEligible(course) ? 'Eligible' : 'Not eligible'}
                    </Badge>
                    <Badge variant="outline">
                      {course.availableSections.length} section
                      {course.availableSections.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <CourseSectionModal
        courseId={selectedCourseId}
        open={selectedCourseId !== null}
        onEnrollSection={enrollInSection}
        enrollingSectionId={enrollingSectionId}
        isSectionEnrolled={isSectionEnrolled}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedCourseId(null);
          }
        }}
      />
    </>
  );
}
