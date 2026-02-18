import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { enroll } from '@/api/enrollments-api';

const CURRENT_STUDENT_ID = 1;

type EnrollMutationData = Awaited<ReturnType<typeof enroll>>;

type UseEnrollOptions = Omit<
  UseMutationOptions<EnrollMutationData, unknown, number>,
  'mutationFn'
>;

export function useEnroll(
  selectedCourseId: number | null,
  options?: UseEnrollOptions,
) {
  return useMutation({
    ...options,
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
  });
}
