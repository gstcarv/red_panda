import { useCallback, useMemo, useState } from 'react';
import { useEnroll } from '@/hooks/enrollments/use-enroll';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';

type UseEnrollmentFlowOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useEnrollmentFlow(
  selectedCourseId: number | null,
  options?: UseEnrollmentFlowOptions,
) {
  const [enrollingSectionId, setEnrollingSectionId] = useState<number | null>(
    null,
  );

  const { data: enrollmentsResponse } = useEnrollments();

  const enrolledSectionIds = useMemo(() => {
    const enrollments = enrollmentsResponse?.data.enrollments ?? [];
    return new Set(enrollments.map((enrollment) => enrollment.courseSection.id));
  }, [enrollmentsResponse]);

  const isSectionEnrolled = useCallback(
    (sectionId: number) => enrolledSectionIds.has(sectionId),
    [enrolledSectionIds],
  );

  const enrollMutation = useEnroll(selectedCourseId, {
    onMutate: (sectionId) => {
      setEnrollingSectionId(sectionId);
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
    onSettled: () => {
      setEnrollingSectionId(null);
    },
  });

  const enrollInSection = useCallback(
    (sectionId: number) => {
      if (isSectionEnrolled(sectionId)) {
        return;
      }

      enrollMutation.mutate(sectionId);
    },
    [enrollMutation, isSectionEnrolled],
  );

  return {
    enrollInSection,
    enrollingSectionId,
    isSectionEnrolled,
    isEnrollmentsLoading: !enrollmentsResponse,
  };
}
