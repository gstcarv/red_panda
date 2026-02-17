import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CourseCard } from './course-card';
import type { Course } from '@/types/course.type';

export interface CoursesListProps {
  courses: Course[];
  /** Optional: determine eligibility per course for the card badge */
  getEligible?: (course: Course) => boolean;
  onEnroll?: (courseId: number) => void;
  enrollingId?: number | null;
  emptyMessage?: string;
  className?: string;
}

export function CoursesList({
  courses,
  getEligible,
  onEnroll,
  enrollingId = null,
  emptyMessage = 'No courses match your filters.',
  className,
}: CoursesListProps) {
  if (courses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
            <BookOpen className="size-6 text-muted-foreground" aria-hidden />
          </div>
          <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className ?? ''}>
      <p className="mb-4 text-sm text-muted-foreground">
        {courses.length} {courses.length === 1 ? 'course' : 'courses'} found
      </p>
      <ul
        className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3"
        role="list"
      >
        {courses.map((course) => (
          <li key={course.id} className="h-full">
            <CourseCard
              course={course}
              eligible={getEligible?.(course) ?? false}
              onEnroll={onEnroll}
              isEnrolling={enrollingId === course.id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
