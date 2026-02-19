import type { AxiosResponse } from 'axios';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { GetStudentEnrollmentsResponse } from '@/api/students-api';
import { unenroll } from '@/api/enrollments-api';
import { buildCoursesQueryKey } from '@/hooks/courses/use-courses';
import { buildEnrollmentsQueryKey } from '@/hooks/enrollments/use-enrollments';
import { buildStudentQueryKey } from '@/hooks/students/use-student';

type UnenrollMutationData = Awaited<ReturnType<typeof unenroll>>;

type UseUnenrollOptions = Omit<
  UseMutationOptions<UnenrollMutationData, unknown, string>,
  'mutationFn'
>;

const CURRENT_STUDENT_ID = 1;

function updateEnrollmentsCacheAfterUnenroll({
  queryClient,
  enrollmentId,
}: {
  queryClient: ReturnType<typeof useQueryClient>;
  enrollmentId: string;
}) {
  queryClient.setQueryData<AxiosResponse<GetStudentEnrollmentsResponse>>(
    buildEnrollmentsQueryKey(),
    (current) => {
      if (!current) {
        return current;
      }

      const nextEnrollments = current.data.enrollments.filter(
        (enrollment) => enrollment.id !== enrollmentId,
      );

      return {
        ...current,
        data: {
          ...current.data,
          enrollments: nextEnrollments,
        },
      };
    },
  );
}


export function useUnenroll(options?: UseUnenrollOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useMutation({
    ...mutationOptions,
    mutationFn: (enrollmentId: string) => unenroll(enrollmentId),
    onSuccess: async (data, enrollmentId, onMutateResult, context) => {
      updateEnrollmentsCacheAfterUnenroll({
        queryClient,
        enrollmentId,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: buildEnrollmentsQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: buildCoursesQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: buildStudentQueryKey(),
        }),
      ]);

      await onSuccess?.(data, enrollmentId, onMutateResult, context);
    },
  });
}
