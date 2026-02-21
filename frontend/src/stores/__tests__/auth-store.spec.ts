import { beforeEach, describe, expect, it, vi } from 'vitest';

const { clearQueryCache } = vi.hoisted(() => ({
  clearQueryCache: vi.fn(),
}));

vi.mock('@/lib/react-query', () => ({
  queryClient: {
    clear: clearQueryCache,
  },
}));

import { useAuthStore } from '@/stores/auth-store';

const EMPTY_AUTH_STATE = {
  token: '',
  expiresIn: 0,
  email: '',
  userId: 0,
};

describe('AuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState(EMPTY_AUTH_STATE);
  });

  it('stores auth data and reports authenticated session', () => {
    useAuthStore.getState().setAuth({
      token: 'token-123',
      expiresIn: 60000,
      email: 'student@school.edu',
      userId: 10,
    });

    const state = useAuthStore.getState();

    expect(state.token).toBe('token-123');

    expect(state.email).toBe('student@school.edu');

    expect(state.isAuthenticated()).toBe(true);
  });

  it('clears auth state and react-query cache on logout', () => {
    useAuthStore.setState({
      token: 'token-123',
      expiresIn: 60000,
      email: 'student@school.edu',
      userId: 10,
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    expect(state.token).toBe('');

    expect(state.userId).toBe(0);

    expect(state.isAuthenticated()).toBe(false);

    expect(clearQueryCache).toHaveBeenCalledTimes(1);
  });
});
