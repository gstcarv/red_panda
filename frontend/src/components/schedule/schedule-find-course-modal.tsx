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
import type { CourseDetails } from '@/types/course.type';
import type { SchedulerSlotSelection } from '@/types/scheduler.type';

type ScheduleFindCourseModalProps = {
  open: boolean;
  slot: SchedulerSlotSelection | null;
  onOpenChange: (open: boolean) => void;
  onEnrollSection?: (sectionId: number) => void;
  onUnenrollSection?: (sectionId: number) => void;
  enrollingSectionId?: number | null;
  unenrollingSectionId?: number | null;
  isSectionEnrolled?: (sectionId: number) => boolean;
};

type CourseWithEligibility = {
  course: CourseDetails;
  eligible: boolean;
};

type ScheduleFindCourseModalViewProps = {
  open: boolean;
  slot: SchedulerSlotSelection | null;
  courses: CourseWithEligibility[];
  isLoading: boolean;
  isError: boolean;
  selectedCourseId: number | null;
  enrollingSectionId: number | null;
  unenrollingSectionId: number | null;
  isSectionEnrolled: (sectionId: number) => boolean;
  onOpenChange: (open: boolean) => void;
  onCourseClick: (courseId: number) => void;
  onCourseDetailsOpenChange: (open: boolean) => void;
  onEnrollSection: (sectionId: number) => void;
  onUnenrollSection: (sectionId: number) => void;
};

function ScheduleFindCourseModalView({
  open,
  slot,
  courses,
  isLoading,
  isError,
  selectedCourseId,
  enrollingSectionId,
  unenrollingSectionId,
  isSectionEnrolled,
  onOpenChange,
  onCourseClick,
  onCourseDetailsOpenChange,
  onEnrollSection,
  onUnenrollSection,
}: ScheduleFindCourseModalViewProps) {
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
              {courses.map(({ course, eligible }) => (
                <Button
                  key={course.id}
                  type="button"
                  variant="outline"
                  className="h-auto w-full justify-between p-4"
                  onClick={() => onCourseClick(course.id)}
                >
                  <div className="text-left">
                    <h3 className="text-base font-semibold">{course.name}</h3>
                    <p className="text-sm font-mono text-muted-foreground">
                      {course.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={eligible ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      {eligible ? (
                        <CheckCircle2 className="size-3" aria-hidden />
                      ) : (
                        <XCircle className="size-3" aria-hidden />
                      )}
                      {eligible ? 'Eligible' : 'Not eligible'}
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
        onEnrollSection={onEnrollSection}
        onUnenrollSection={onUnenrollSection}
        enrollingSectionId={enrollingSectionId}
        unenrollingSectionId={unenrollingSectionId}
        isSectionEnrolled={isSectionEnrolled}
        onOpenChange={onCourseDetailsOpenChange}
      />
    </>
  );
}

export function ScheduleFindCourseModal({
  open,
  slot,
  onOpenChange,
  onEnrollSection,
  onUnenrollSection,
  enrollingSectionId = null,
  unenrollingSectionId = null,
  isSectionEnrolled = () => false,
}: ScheduleFindCourseModalProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const queryParams = slot
    ? {
        weekDay: slot.weekDay,
        startTime: slot.startTime,
      }
    : null;

  const { data, isLoading, isError } = useAvailableCoursesBySlot(queryParams);
  const { data: enrollmentsResponse } = useEnrollments();
  const enrolledCourseIds = useMemo(() => {
    const enrollments = enrollmentsResponse?.data.enrollments ?? [];
    return new Set(enrollments.map((enrollment) => enrollment.course.id));
  }, [enrollmentsResponse]);
  const coursesWithEligibility = useMemo<CourseWithEligibility[]>(() => {
    const availableCourses = data?.data.courses ?? [];

    return availableCourses.map((course) => ({
      course,
      eligible: course.prerequisite
        ? enrolledCourseIds.has(course.prerequisite.id)
        : true,
    }));
  }, [data, enrolledCourseIds]);

  return (
    <ScheduleFindCourseModalView
      open={open}
      slot={slot}
      courses={coursesWithEligibility}
      isLoading={isLoading}
      isError={isError}
      selectedCourseId={selectedCourseId}
      enrollingSectionId={enrollingSectionId}
      unenrollingSectionId={unenrollingSectionId}
      isSectionEnrolled={isSectionEnrolled}
      onOpenChange={onOpenChange}
      onCourseClick={(courseId) => {
        setSelectedCourseId(courseId);
        onOpenChange(false);
      }}
      onCourseDetailsOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedCourseId(null);
        }
      }}
      onEnrollSection={onEnrollSection ?? (() => undefined)}
      onUnenrollSection={onUnenrollSection ?? (() => undefined)}
    />
  );
}
