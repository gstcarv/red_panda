import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStudent } from '@/hooks/students/use-student';

interface GraduationAccessGuardProps {
  children: ReactNode;
}

export function GraduationAccessGuard({ children }: GraduationAccessGuardProps) {
  const { data, isLoading } = useStudent();
  const student = data?.student;
  const earnedCredits = student?.credits?.earned ?? 0;
  const requiredCredits = student?.credits?.max ?? 0;
  const hasGraduated = requiredCredits > 0 && earnedCredits >= requiredCredits;

  if (isLoading) {
    return null;
  }

  if (hasGraduated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
