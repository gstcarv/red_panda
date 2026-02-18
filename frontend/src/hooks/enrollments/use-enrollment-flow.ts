import { useCallback, useMemo, useState } from 'react';
import { useEnroll } from '@/hooks/enrollments/use-enroll';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useUnenroll } from '@/hooks/enrollments/use-unenroll';

type UseEnrollmentFlowOptions = {
  onSuccess?: () => void;
  onUnenrollSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useEnrollmentFlow(
  selectedCourseId: number | null,
  options?: UseEnrollmentFlowOptions,
) {
  const [enrollingSectionId, setEnrollingSectionId] = useState<number | null>(
    null,
  );
  const [unenrollingSectionId, setUnenrollingSectionId] = useState<number | null>(
    null,
  );

  const { data: enrollmentsResponse } = useEnrollments();
  const enrollments = enrollmentsResponse?.data.enrollments ?? [];

  const enrolledSectionIds = useMemo(() => {
    return new Set(enrollments.map((enrollment) => enrollment.courseSection.id));
  }, [enrollments]);

  const enrollmentIdBySectionId = useMemo(() => {
    return new Map(
      enrollments.map((enrollment) => [enrollment.courseSection.id, enrollment.id]),
    );
  }, [enrollments]);

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

  const unenrollMutation = useUnenroll({
    onMutate: (enrollmentId) => {
      const sectionId = enrollments.find(
        (enrollment) => enrollment.id === enrollmentId,
      )?.courseSection.id;

      if (sectionId) {
        setUnenrollingSectionId(sectionId);
      }
    },
    onSuccess: () => {
      options?.onUnenrollSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
    onSettled: () => {
      setUnenrollingSectionId(null);
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

  const unenrollFromSection = useCallback(
    (sectionId: number) => {
      const enrollmentId = enrollmentIdBySectionId.get(sectionId);

      if (!enrollmentId) {
        return;
      }

      unenrollMutation.mutate(enrollmentId);
    },
    [enrollmentIdBySectionId, unenrollMutation],
  );

  return {
    enrollInSection,
    unenrollFromSection,
    enrollingSectionId,
    unenrollingSectionId,
    isSectionEnrolled,
    isEnrollmentsLoading: !enrollmentsResponse,
  };
}
