import { Suspense, lazy, useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useCourseDetailsModal } from '@/hooks/courses/use-course-details-modal';
import { cn } from '@/lib/utils';
import type { CoursePrerequisite } from '@/types/course.type';

const LazyCourseSectionModal = lazy(async () => {
  const module = await import('@/components/courses/course-section-modal');
  return { default: module.CourseSectionModal };
});

type PrerequisiteLinkProps = {
  prerequisite: CoursePrerequisite;
  onCourseSelect?: (courseId: number) => void;
  className?: string;
};

export function PrerequisiteLink({
  prerequisite,
  onCourseSelect,
  className,
}: PrerequisiteLinkProps) {
  const { selectedCourseId, modalOpen, handleCourseSelect, handleModalClose } =
    useCourseDetailsModal({ onCourseSelect });
  const [hasOpenedModal, setHasOpenedModal] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHasOpenedModal(true);
    handleCourseSelect(prerequisite.id);
  };

  return (
    <>
      <Button
        type="button"
        variant="link"
        className={cn(
          'h-auto p-0 text-xs font-normal text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground',
          className,
        )}
        onClick={handleClick}
      >
        {prerequisite.code} - {prerequisite.name}
      </Button>
      {hasOpenedModal ? (
        <Suspense fallback={null}>
          <LazyCourseSectionModal
            courseId={selectedCourseId}
            open={modalOpen}
            onOpenChange={handleModalClose}
          />
        </Suspense>
      ) : null}
    </>
  );
}
