import type { CourseHistory } from '@/types/course-history.type';

export interface DashboardMetrics {
  gpa: number;
  earnedCredits: number;
  requiredCredits: number;
  remainingCredits: number;
  graduationPercent: number;
  passedCount: number;
  failedCount: number;
}

export interface DashboardSummaryCardsProps {
  isLoading: boolean;
  metrics: DashboardMetrics;
}

export interface GraduationProgressCardProps {
  isLoading: boolean;
  metrics: DashboardMetrics;
}

export interface CourseHistoryCardProps {
  isLoading: boolean;
  history: CourseHistory[];
  metrics: DashboardMetrics;
  onCourseClick?: (courseId: number, semesterId: number, status: CourseHistory['status']) => void;
}
