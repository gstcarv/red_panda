import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CourseSectionList } from './course-section-list';
import { useCourseById } from '@/hooks/courses/use-course-by-id';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CourseDetails } from '@/types/course.type';

export interface CourseSectionModalProps {
  courseId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnrollSection?: (sectionId: number) => void;
  onUnenrollSection?: (sectionId: number) => void;
  enrollingSectionId?: number | null;
  unenrollingSectionId?: number | null;
  isSectionEnrolled?: (sectionId: number) => boolean;
}

export function CourseSectionModal({
  courseId,
  open,
  onOpenChange,
  onEnrollSection,
  onUnenrollSection,
  enrollingSectionId = null,
  unenrollingSectionId = null,
  isSectionEnrolled,
}: CourseSectionModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [cachedCourse, setCachedCourse] = useState<CourseDetails | null>(null);
  const { data, isLoading, isError } = useCourseById(courseId);

  const courseData = data?.data;

  // Cache course data when it's loaded
  useEffect(() => {
    if (courseData) {
      setCachedCourse(courseData);
    }
  }, [courseData]);

  // Clear cache after modal closes (with delay for animation)
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setCachedCourse(null);
      }, 350); // Slightly longer than animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Use cached course if available, otherwise use current data
  // This prevents flicker during close animation
  const course = cachedCourse || courseData;

  const content = (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load course details. Please try again.
          </AlertDescription>
        </Alert>
      ) : course ? (
        <>
          {/* Course Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <h2 className="text-xl font-bold tracking-tight">
                  {course.name}
                </h2>
                <p className="text-sm text-muted-foreground font-mono">
                  {course.code}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
              </Badge>
            </div>

            {/* Course Details Grid */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">Hours per Week</p>
                  <p className="text-muted-foreground text-xs">
                    {course.hoursPerWeek}h/week
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">Grade Level</p>
                  <p className="text-muted-foreground text-xs">
                    Grades {course.gradeLevel.min}–{course.gradeLevel.max}
                  </p>
                </div>
              </div>
              {course.prerequisite && (
                <div className="flex items-center gap-2 col-span-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium">Prerequisite</p>
                    <p className="text-muted-foreground text-xs">
                      {course.prerequisite.code} - {course.prerequisite.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sections */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Available Sections</h3>
                <Badge variant="outline" className="text-xs">
                  {course.availableSections.length} section
                  {course.availableSections.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <CourseSectionList
                sections={course.availableSections}
                onEnroll={onEnrollSection}
                onUnenroll={onUnenrollSection}
                enrollingSectionId={enrollingSectionId}
                unenrollingSectionId={unenrollingSectionId}
                isSectionEnrolled={isSectionEnrolled}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>
              View course information and available sections
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Course Details</SheetTitle>
          <SheetDescription>
            View course information and available sections
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">{content}</div>
      </SheetContent>
    </Sheet>
  );
}
