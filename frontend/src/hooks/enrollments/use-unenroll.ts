import { unenroll } from '@/api/students-api';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { unenrollMutationOptions } from '@/queries/enrollments/query';

type UnenrollMutationData = Awaited<ReturnType<typeof unenroll>>;
type UseUnenrollOptions = Omit<
  UseMutationOptions<UnenrollMutationData, unknown, number>,
  'mutationFn'
>;

export function useUnenroll(options?: UseUnenrollOptions) {
  return useMutation(unenrollMutationOptions(options));
}
