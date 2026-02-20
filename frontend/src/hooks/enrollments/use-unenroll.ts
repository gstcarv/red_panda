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
  UseMutationOptions<UnenrollMutationData, unknown, number>,
  'mutationFn'
>;

function updateEnrollmentsCacheAfterUnenroll({
  queryClient,
  courseId,
}: {
  queryClient: ReturnType<typeof useQueryClient>;
  courseId: number;
}) {
  queryClient.setQueryData<AxiosResponse<GetStudentEnrollmentsResponse>>(
    buildEnrollmentsQueryKey(),
    (current) => {
      if (!current) {
        return current;
      }

      const nextEnrollments = current.data.enrollments.filter(
        (enrollment) => enrollment.course.id !== courseId,
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
    mutationFn: (courseId: number) => unenroll(courseId),
    onSuccess: async (data, courseId, onMutateResult, context) => {
      updateEnrollmentsCacheAfterUnenroll({
        queryClient,
        courseId,
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

      await onSuccess?.(data, courseId, onMutateResult, context);
    },
  });
}
