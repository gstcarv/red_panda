import { Suspense, lazy, useMemo, useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useCourseDetailsModal } from '@/hooks/courses/use-course-details-modal';
import {
  useCheckCourseStatus,
  type CourseStudentStatus,
} from '@/hooks/courses/use-check-course-status';
import { cn } from '@/lib/utils';
import type { Course, CoursePrerequisite } from '@/types/course.type';

const LazyCourseDetailsModal = lazy(async () => {
  const module = await import('@/components/courses/course-details-modal');
  return { default: module.CourseDetailsModal };
});

type PrerequisiteLinkProps = {
  prerequisite: CoursePrerequisite;
  onCourseSelect?: (courseId: number, semesterId?: number) => void;
  className?: string;
};

function getStatusUi(status: CourseStudentStatus) {
  switch (status) {
    case 'passed':
      return {
        Icon: CheckCircle2,
        className: 'text-green-600',
      } as const;
    case 'enrolled':
      return {
        Icon: CheckCircle,
        className: 'text-purple-600',
      } as const;
    case 'failed':
      return {
        Icon: XCircle,
        className: 'text-red-600',
      } as const;
  }
}

export function PrerequisiteLink({
  prerequisite,
  onCourseSelect,
  className,
}: PrerequisiteLinkProps) {
  const { selectedCourseId, selectedSemesterId, modalOpen, handleCourseSelect, handleModalClose } =
    useCourseDetailsModal({ onCourseSelect });
  const [hasOpenedModal, setHasOpenedModal] = useState(false);

  const prerequisiteCourseForStatus = useMemo(() => {
    return {
      id: prerequisite.id,
      code: prerequisite.code,
      name: prerequisite.name,
      credits: 0,
      hoursPerWeek: 0,
      gradeLevel: { min: 0, max: 0 },
      availableSections: [],
    } satisfies Course;
  }, [prerequisite.code, prerequisite.id, prerequisite.name]);

  const { status, foundCourseHistory } = useCheckCourseStatus(prerequisiteCourseForStatus);
  const statusUi = status ? getStatusUi(status) : null;

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
        <span className="inline-flex items-center gap-1">
          {prerequisite.code} - {prerequisite.name}
          {statusUi ? (
            <statusUi.Icon className={cn('size-3', statusUi.className)} aria-hidden />
          ) : null}
        </span>
      </Button>
      {hasOpenedModal ? (
        <Suspense fallback={null}>
          <LazyCourseDetailsModal
            courseId={selectedCourseId}
            semesterId={foundCourseHistory?.semester.id || selectedSemesterId}
            open={modalOpen}
            onOpenChange={handleModalClose}
          />
        </Suspense>
      ) : null}
    </>
  );
}
