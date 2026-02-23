import { mutationOptions, type UseMutationOptions } from '@tanstack/react-query';
import * as authApi from '@/api/auth-api';

type LoginMutationData = Awaited<ReturnType<typeof authApi.login>>;
export type UseLoginOptions = Omit<
  UseMutationOptions<LoginMutationData, unknown, authApi.LoginRequest>,
  'mutationFn'
>;

export function loginMutationOptions(options?: UseLoginOptions) {
  return mutationOptions({
    ...options,
    mutationFn: (payload: authApi.LoginRequest) => authApi.login(payload),
  });
}
