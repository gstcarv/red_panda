import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { login, type LoginRequest } from '@/api/auth-api';

type LoginMutationData = Awaited<ReturnType<typeof login>>;

type UseLoginOptions = Omit<
  UseMutationOptions<LoginMutationData, unknown, LoginRequest>,
  'mutationFn'
>;

export function useLogin(options?: UseLoginOptions) {
  return useMutation({
    ...options,
    mutationFn: login,
  });
}
