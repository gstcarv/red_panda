import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { useValidLoginUsers } from '@/hooks/auth/use-valid-login-users';

const fetchMock = mockFn<typeof fetch>();

describe('useValidLoginUsers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads valid users from static json file', async () => {
    fetchMock.mockResolvedValue({
      json: async () => ['one@student.edu', 'two@student.edu'],
    } as never);

    const { result } = renderHook(() => useValidLoginUsers());

    await waitFor(() => {
      expect(result.current).toHaveLength(2);
    });

    expect(fetchMock).toHaveBeenCalledWith('/valid-login-users.json');

    expect(result.current).toContain('one@student.edu');
  });

  it('returns empty list when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useValidLoginUsers());

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });
});
