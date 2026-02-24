import { useMutation } from '@tanstack/react-query';
import { loginMutationOptions, type UseLoginOptions } from '@/queries/auth/query';

export function useLogin(options?: UseLoginOptions) {
  return useMutation(loginMutationOptions(options));
}
