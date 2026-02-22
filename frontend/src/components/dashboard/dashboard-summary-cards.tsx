import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardMetrics } from '@/types/dashboard.type';

function formatGpa(value: number) {
  return value.toFixed(2);
}

function formatCredits(earned: number, max: number) {
  return `${earned}/${max}`;
}

interface DashboardSummaryCardsProps {
  isLoading: boolean;
  metrics: DashboardMetrics;
}

export function DashboardSummaryCards({
  isLoading,
  metrics,
}: DashboardSummaryCardsProps) {
  return (
    <section
      aria-label="Academic summary metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <Card>
        <CardHeader>
          <CardDescription>Current GPA</CardDescription>
          <CardTitle className="text-3xl">
            {isLoading ? <Skeleton className="h-8 w-20" /> : formatGpa(metrics.gpa)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Credits Earned</CardDescription>
          <CardTitle className="text-3xl">
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              formatCredits(metrics.earnedCredits, metrics.requiredCredits)
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Credits Remaining</CardDescription>
          <CardTitle className="text-3xl">
            {isLoading ? <Skeleton className="h-8 w-20" /> : metrics.remainingCredits}
          </CardTitle>
        </CardHeader>
      </Card>
    </section>
  );
}
