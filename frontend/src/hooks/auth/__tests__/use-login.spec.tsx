import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { useLogin } from '@/hooks/auth/use-login';
import { login } from '@/api/auth-api';

vi.mock('@/api/auth-api', () => ({
  login: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useLogin', () => {
  it('calls auth login api with submitted email', async () => {
    const loginMock = vi.mocked(login);
    loginMock.mockResolvedValue({
      data: {
        token: 'token-1',
        expiresIn: 1000,
        email: 'student@school.edu',
        userId: 1,
      },
    } as never);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ email: 'student@school.edu' });

    expect(loginMock).toHaveBeenCalledWith({ email: 'student@school.edu' });
  });

  it('triggers mutation callbacks passed in options', async () => {
    const loginMock = vi.mocked(login);
    loginMock.mockResolvedValue({
      data: {
        token: 'token-1',
        expiresIn: 1000,
        email: 'student@school.edu',
        userId: 1,
      },
    } as never);
    const onSuccess = mockFn<() => void>();

    const { result } = renderHook(
      () =>
        useLogin({
          onSuccess,
        }),
      { wrapper: createWrapper() },
    );

    await result.current.mutateAsync({ email: 'student@school.edu' });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
