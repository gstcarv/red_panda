import { CourseCard, EnrollmentActionButton } from '@/components/courses';
import type { Course } from '@/types/course.type';

type SchedulerListProps = {
  enrolledCourses: EnrolledCourseItem[];
  isLoading?: boolean;
  unenrollingEnrollmentId?: string | null;
  onUnenroll?: (enrollmentId: string) => void;
  onCourseHoverChange?: (courseId: number | null) => void;
};

export type EnrolledCourseItem = {
  enrollmentId: string;
  course: Course;
};

type SchedulerListViewProps = {
  enrolledCourses: EnrolledCourseItem[];
  unenrollingEnrollmentId: string | null;
  onCardHoverChange?: (courseId: number | null) => void;
  onUnenroll: (enrollmentId: string) => void;
};

function SchedulerListView({
  enrolledCourses,
  unenrollingEnrollmentId,
  onCardHoverChange,
  onUnenroll,
}: SchedulerListViewProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4" aria-label="Course cards">
      {enrolledCourses.map((course) => (
        <div
          key={course.course.id}
          data-testid="schedule-course-card"
          onMouseEnter={() => onCardHoverChange?.(course.course.id)}
          onMouseLeave={() => onCardHoverChange?.(null)}
        >
          <CourseCard
            course={course.course}
            eligible
            footerAction={
              <EnrollmentActionButton
                isEnrolled
                isPending={unenrollingEnrollmentId === course.enrollmentId}
                onUnenroll={() => onUnenroll(course.enrollmentId)}
                confirmTitle="Unenroll from course?"
                confirmDescription="This action will remove the course from your current schedule."
                className="h-8 px-3 text-xs"
              />
            }
          />
        </div>
      ))}
    </div>
  );
}

export function SchedulerList({
  enrolledCourses,
  isLoading = false,
  unenrollingEnrollmentId = null,
  onUnenroll,
  onCourseHoverChange,
}: SchedulerListProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground"
        aria-live="polite"
      >
        Loading enrolled courses...
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
        No enrolled courses yet.
      </div>
    );
  }

  return (
    <SchedulerListView
      enrolledCourses={enrolledCourses}
      unenrollingEnrollmentId={unenrollingEnrollmentId}
      onCardHoverChange={onCourseHoverChange}
      onUnenroll={onUnenroll ?? (() => undefined)}
    />
  );
}
