import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

type GuestOnlyGuardProps = {
  children: ReactNode;
};

export function GuestOnlyGuard({ children }: GuestOnlyGuardProps) {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);

  if (token && userId) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
