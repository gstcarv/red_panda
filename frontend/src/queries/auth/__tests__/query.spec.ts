import * as authApi from '@/api/auth-api';
import { loginMutationOptions } from '@/queries/auth/query';
import { describe, expect, it, vi } from 'vitest';

describe('auth mutation options', () => {
  it('builds login mutation options', async () => {
    const loginSpy = vi.spyOn(authApi, 'login').mockResolvedValue({} as never);
    const options = loginMutationOptions();

    await options.mutationFn?.({ email: 'student@school.edu' }, {} as never);

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'student@school.edu',
    });
  });
});
