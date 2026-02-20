import type { AxiosResponse } from 'axios';
import merge from 'lodash.merge';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { Enrollment } from '@/types/enrollments.type';
import { enroll, type GetStudentEnrollmentsResponse } from '@/api/students-api';
import { buildCoursesQueryKey } from '@/hooks/courses/use-courses';
import { buildEnrollmentsQueryKey } from '@/hooks/enrollments/use-enrollments';
import { buildStudentQueryKey } from '@/hooks/students/use-student';

const CURRENT_STUDENT_ID = 1;

type EnrollMutationData = Awaited<ReturnType<typeof enroll>>;

type UseEnrollOptions = Omit<
  UseMutationOptions<EnrollMutationData, unknown, number>,
  'mutationFn'
>;

function updateEnrollmentsCacheAfterEnroll({
  queryClient,
  enrollment,
}: {
  queryClient: ReturnType<typeof useQueryClient>;
  enrollment: Enrollment;
}) {
  queryClient.setQueryData<AxiosResponse<GetStudentEnrollmentsResponse>>(
    buildEnrollmentsQueryKey(),
    (current) => {
      if (!current) {
        return current;
      }

      const alreadyExists = current.data.enrollments.some(
        (value) => value.courseSection.id === enrollment.courseSection.id,
      );

      if (alreadyExists) {
        return current;
      }

      return merge({}, current, {
        data: {
          enrollments: [...current.data.enrollments, enrollment],
        },
      });
    },
  );
}


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
        studentId: CURRENT_STUDENT_ID,
        courseId: selectedCourseId,
        sectionId,
      });
    },
    onSuccess: async (data, sectionId, onMutateResult, context) => {
      const enrollmentsQueryKey = buildEnrollmentsQueryKey();
      const enrollment = data.data.enrollment;

      if (enrollment) {
        updateEnrollmentsCacheAfterEnroll({
          queryClient,
          enrollment,
        });
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: enrollmentsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: buildCoursesQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: buildStudentQueryKey(),
        }),
      ]);

      await onSuccess?.(data, sectionId, onMutateResult, context);
    },
  });
}
