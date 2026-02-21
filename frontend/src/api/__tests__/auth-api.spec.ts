import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { api } from '@/config/api';
import * as authApi from '@/api/auth-api';

describe('auth api module', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests login endpoint with email payload', async () => {
    const postMock = mockFn<typeof api.post>();
    postMock.mockResolvedValue({
      data: {
        token: 'token-1',
        expiresIn: 1000,
        email: 'student@school.edu',
        userId: 1,
      },
    } as never);
    vi.spyOn(api, 'post').mockImplementation(postMock);

    await authApi.login({ email: 'student@school.edu' });

    expect(postMock).toHaveBeenCalledWith('/login', {
      email: 'student@school.edu',
    });
  });
});
