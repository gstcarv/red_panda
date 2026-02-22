import { unenroll } from '@/api/students-api';
import { enrollmentsCache } from '@/helpers/cache/enrollment-cache';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

type UnenrollMutationData = Awaited<ReturnType<typeof unenroll>>;

type UseUnenrollOptions = Omit<
  UseMutationOptions<UnenrollMutationData, unknown, number>,
  'mutationFn'
>;


export function useUnenroll(options?: UseUnenrollOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useMutation({
    ...mutationOptions,
    mutationFn: (courseId: number) => unenroll(courseId),
    onSuccess: async (data, courseId, onMutateResult, context) => {
      enrollmentsCache.removeEnrollmentByCourseId({
        queryClient,
        courseId,
      });

      await enrollmentsCache.invalidate({ queryClient });

      await onSuccess?.(data, courseId, onMutateResult, context);
    },
  });
}
