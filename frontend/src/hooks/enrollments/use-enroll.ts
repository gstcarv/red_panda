import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { enroll } from '@/api/students-api';
import { enrollMutationOptions } from '@/queries/enrollments/query';

type EnrollMutationData = Awaited<ReturnType<typeof enroll>>;
type UseEnrollOptions = Omit<UseMutationOptions<EnrollMutationData, unknown, number>, 'mutationFn'>;

export function useEnroll(selectedCourseId: number | null, options?: UseEnrollOptions) {
    return useMutation(enrollMutationOptions(selectedCourseId, options));
}
