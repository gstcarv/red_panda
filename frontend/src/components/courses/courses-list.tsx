import { useState } from 'react';
import { AlertCircle, BookOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CourseCard } from './course-card';
import { CourseSectionModal } from './course-section-modal';
import type { Course } from '@/types/course.type';

export interface CoursesListProps {
  courses: Course[];
  /** Optional: determine eligibility per course for the card badge */
  getEligible?: (course: Course) => boolean;
  onEnrollSection?: (sectionId: number) => void;
  enrollingSectionId?: number | null;
  emptyMessage?: string;
  className?: string;
  /** When true, shows skeleton placeholders instead of the list */
  isLoading?: boolean;
  /** When true, shows an error state with optional retry */
  isError?: boolean;
  onRetry?: () => void;
  /** Optional: controlled selected course ID */
  selectedCourseId?: number | null;
  /** Optional: callback when a course is selected */
  onCourseSelect?: (courseId: number) => void;
  /** Optional: callback when modal closes */
  onModalClose?: (open: boolean) => void;
}

function CourseCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-0 py-0">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pt-6 pb-2">
        <div className="min-w-0 space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-20" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full shrink-0" />
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <Skeleton className="h-4 w-full max-w-[200px]" />
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 border-t border-border pt-4 pb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-20" />
      </CardFooter>
    </Card>
  );
}

export function CoursesList({
  courses,
  getEligible,
  onEnrollSection,
  enrollingSectionId = null,
  emptyMessage = 'No courses match your filters.',
  className,
  isLoading = false,
  isError = false,
  onRetry,
  selectedCourseId: controlledSelectedCourseId,
  onCourseSelect,
  onModalClose,
}: CoursesListProps) {
  const [internalSelectedCourseId, setInternalSelectedCourseId] = useState<
    number | null
  >(null);
  const selectedCourseId =
    controlledSelectedCourseId !== undefined
      ? controlledSelectedCourseId
      : internalSelectedCourseId;
  const modalOpen = selectedCourseId !== null;

  const handleCourseSelect = (courseId: number) => {
    if (onCourseSelect) {
      onCourseSelect(courseId);
    } else {
      setInternalSelectedCourseId(courseId);
    }
  };

  const handleModalClose = (open: boolean) => {
    if (onModalClose) {
      onModalClose(open);
    } else if (!open) {
      setInternalSelectedCourseId(null);
    }
  };
  if (isLoading) {
    return (
      <div className={className ?? ''}>
        <Skeleton className="h-4 w-32 mb-4" />
        <ul
          className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3"
          role="list"
          aria-busy="true"
          aria-label="Loading courses"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="h-full">
              <CourseCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
            <AlertCircle className="size-6" aria-hidden />
          </div>
          <p className="text-sm font-medium text-foreground">
            Failed to load courses
          </p>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Something went wrong. Please try again.
          </p>
          {onRetry && (
            <Button variant="outline" className="mt-4" onClick={onRetry}>
              Try again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

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
              onClick={handleCourseSelect}
            />
          </li>
        ))}
      </ul>
      <CourseSectionModal
        courseId={selectedCourseId}
        open={modalOpen}
        onOpenChange={handleModalClose}
        onEnrollSection={onEnrollSection}
        enrollingSectionId={enrollingSectionId}
      />
    </div>
  );
}
