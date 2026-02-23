import {
  mutationOptions,
  queryOptions,
  type MutationOptions,
} from '@tanstack/react-query';
import * as studentsApi from '@/api/students-api';
import { enrollmentsCache } from './cache';

export const getStudentEnrollments = queryOptions({
  queryKey: enrollmentsCache.buildEnrollmentQueryKey(),
  queryFn: () => studentsApi.getStudentEnrollments(),
});

export function enrollMutationOptions(
  selectedCourseId: number | null,
  options?: Omit<
    MutationOptions<Awaited<ReturnType<typeof studentsApi.enroll>>, unknown, number>,
    'mutationFn'
  >,
) {
  const { onSuccess, ...mutationOptionsConfig } = options ?? {};

  return mutationOptions({
    ...mutationOptionsConfig,
    mutationFn: async (sectionId: number) => {
      if (!selectedCourseId) {
        throw new Error('No course selected');
      }

      return studentsApi.enroll({
        courseId: selectedCourseId,
        sectionId,
      });
    },
    onSuccess: async (data, sectionId, onMutateResult, context) => {
      const enrollment = data.enrollment;

      if (enrollment) {
        enrollmentsCache.addEnrollment({
          enrollment,
        });
      }

      await enrollmentsCache.invalidate();
      await onSuccess?.(data, sectionId, onMutateResult, context);
    },
  });
}

export function unenrollMutationOptions(
  options?: Omit<
    MutationOptions<Awaited<ReturnType<typeof studentsApi.unenroll>>, unknown, number>,
    'mutationFn'
  >,
) {
  const { onSuccess, ...mutationOptionsConfig } = options ?? {};

  return mutationOptions({
    ...mutationOptionsConfig,
    mutationFn: (courseId: number) => studentsApi.unenroll(courseId),
    onSuccess: async (data, courseId, onMutateResult, context) => {
      enrollmentsCache.removeEnrollmentByCourseId({
        courseId,
      });

      await enrollmentsCache.invalidate();
      await onSuccess?.(data, courseId, onMutateResult, context);
    },
  });
}
