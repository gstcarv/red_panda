import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { enroll } from '@/api/students-api';
import { enrollmentsCache } from '@/helpers/cache/enrollment-cache';

type EnrollMutationData = Awaited<ReturnType<typeof enroll>>;

type UseEnrollOptions = Omit<UseMutationOptions<EnrollMutationData, unknown, number>, 'mutationFn'>;


export function useEnroll(
  selectedCourseId: number | null,
  options?: UseEnrollOptions,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useMutation({
    ...mutationOptions,
    mutationFn: async (sectionId: number) => {
      if (!selectedCourseId) {
        throw new Error('No course selected');
      }

      return enroll({
        courseId: selectedCourseId,
        sectionId,
      });
    },
    onSuccess: async (data, sectionId, onMutateResult, context) => {
      const enrollment = data.enrollment;

      if (enrollment) {
        enrollmentsCache.addEnrollment({
          queryClient,
          enrollment,
        });
      }

      await enrollmentsCache.invalidate({ queryClient });

      await onSuccess?.(data, sectionId, onMutateResult, context);
    },
  });
}
