import { useCallback, useMemo } from 'react';
import { useCourseHistory } from '@/hooks/courses/use-course-history';
import { useStudent } from '@/hooks/students/use-student';
import type { DashboardMetrics } from '@/types/dashboard.type';

export function useDashboard() {
  const studentQuery = useStudent();
  const historyQuery = useCourseHistory();

  const student = studentQuery.data?.student;
  const history = historyQuery.data?.courseHistory ?? [];

  const isLoading = studentQuery.isLoading || historyQuery.isLoading;
  const isError = studentQuery.isError || historyQuery.isError;

  const metrics = useMemo<DashboardMetrics>(() => {
    const gpa = student?.gpa ?? 0;
    const earnedCredits = student?.credits.earned ?? 0;
    const requiredCredits = student?.credits.max ?? 0;
    const remainingCredits = Math.max(0, requiredCredits - earnedCredits);
    const graduationPercent =
      requiredCredits > 0
        ? Math.min(100, (earnedCredits / requiredCredits) * 100)
        : 0;
    const passedCount = history.filter((item) => item.status === 'passed').length;
    const failedCount = history.filter((item) => item.status === 'failed').length;

    return {
      gpa,
      earnedCredits,
      requiredCredits,
      remainingCredits,
      graduationPercent,
      passedCount,
      failedCount,
    };
  }, [history, student]);

  const historyByMostRecent = useMemo(() => {
    return [...history].sort((a, b) => {
      if (b.semester.year !== a.semester.year) {
        return b.semester.year - a.semester.year;
      }
      return b.semester.order_in_year - a.semester.order_in_year;
    });
  }, [history]);

  const retry = useCallback(async () => {
    await Promise.all([studentQuery.refetch(), historyQuery.refetch()]);
  }, [historyQuery, studentQuery]);

  return {
    isLoading,
    isError,
    metrics,
    historyByMostRecent,
    retry,
  };
}
