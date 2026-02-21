import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);

  if (!token || !userId) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
