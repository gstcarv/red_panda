import { useMemo } from 'react';
import { CourseCard } from '@/components/courses';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';

export function SchedulerList() {
  const { data: enrollmentsResponse } = useEnrollments();

  const enrolledCourses = useMemo(() => {
    const enrollments = enrollmentsResponse?.data.enrollments ?? [];
    const coursesById = new Map<number, (typeof enrollments)[number]['course']>();

    for (const enrollment of enrollments) {
      coursesById.set(enrollment.course.id, enrollment.course);
    }

    return Array.from(coursesById.values());
  }, [enrollmentsResponse]);

  if (!enrollmentsResponse) {
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
        <div key={course.id} data-testid="schedule-course-card">
          <CourseCard course={course} eligible />
        </div>
      ))}
    </div>
  );
}
