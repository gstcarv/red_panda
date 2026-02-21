import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyAuthHeader, handleApiError } from '@/config/api';
import { useAuthStore } from '@/stores/auth-store';

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

const mockedGetState = vi.mocked(useAuthStore.getState);

describe('api config interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds bearer token to request headers when authenticated', () => {
    mockedGetState.mockReturnValue({
      token: 'abc123',
    } as never);

    const config = {
      headers: {},
    } as InternalAxiosRequestConfig;

    const result = applyAuthHeader(config);

    expect(result.headers.Authorization).toBe('Bearer abc123');
  });

  it('logs out and redirects to login on 401 responses', async () => {
    const logout = vi.fn();
    mockedGetState.mockReturnValue({
      logout,
    } as never);
    window.history.pushState({}, '', '/login');

    const error = {
      response: { status: 401 },
    } as AxiosError;

    await expect(handleApiError(error)).rejects.toBe(error);

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
