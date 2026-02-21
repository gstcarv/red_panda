import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthGuard } from '@/components/layout/auth-guard';
import { GuestOnlyGuard } from '@/components/layout/guest-only-guard';
import { useAuthStore } from '@/stores/auth-store';

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: vi.fn(),
}));

const mockedUseAuthStore = vi.mocked(useAuthStore);

describe('Auth and guest route guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects protected routes to login when user is not authenticated', () => {
    mockedUseAuthStore.mockImplementation((selector) =>
      selector({ token: '', userId: 0 } as never),
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <div>Dashboard</div>
              </AuthGuard>
            }
          />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('redirects login route to dashboard when user is already authenticated', () => {
    mockedUseAuthStore.mockImplementation((selector) =>
      selector({ token: 'token', userId: 10 } as never),
    );

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route
            path="/login"
            element={
              <GuestOnlyGuard>
                <div>Login</div>
              </GuestOnlyGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });
});
