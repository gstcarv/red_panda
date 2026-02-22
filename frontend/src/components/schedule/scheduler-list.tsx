import { CourseCard, EnrollmentActionButton } from '@/components/courses';
import type { Course } from '@/types/course.type';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useMemo } from 'react';

type SchedulerListProps = {
  onCourseHoverChange?: (courseId: number | null) => void;
};

export type EnrolledCourseItem = {
  enrollmentId: string;
  sectionId: number;
  course: Course;
};

export function SchedulerList({
  onCourseHoverChange,
}: SchedulerListProps) {
  const { data: enrollmentsResponse } = useEnrollments();
  const enrolledCourses = useMemo<EnrolledCourseItem[]>(() => {
    const enrollments = enrollmentsResponse?.enrollments ?? [];
    const coursesById = new Map<number, EnrolledCourseItem>();

    for (const enrollment of enrollments) {
      coursesById.set(enrollment.course.id, {
        enrollmentId: enrollment.id,
        sectionId: enrollment.courseSection.id,
        course: enrollment.course,
      });
    }

    return Array.from(coursesById.values());
  }, [enrollmentsResponse]);
  const isLoading = !enrollmentsResponse;

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
    <div className="flex flex-col gap-3 sm:gap-4" aria-label="Course cards">
      {enrolledCourses.map((course) => (
        <div
          key={course.course.id}
          data-testid="schedule-course-card"
          onMouseEnter={() => onCourseHoverChange?.(course.course.id)}
          onMouseLeave={() => onCourseHoverChange?.(null)}
        >
          <CourseCard
            course={course.course}
            eligible
            footerAction={
              <EnrollmentActionButton
                courseId={course.course.id}
                sectionId={course.sectionId}
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
