import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatGraduationPercent } from './formatters';
import type { GraduationProgressCardProps } from './types';

export function GraduationProgressCard({
  isLoading,
  metrics,
}: GraduationProgressCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <span className="shrink-0 text-sm font-medium text-foreground">
          Graduation Progress
        </span>
        {isLoading ? (
          <Skeleton className="h-4 w-48" />
        ) : (
          <span className="shrink-0 text-sm text-muted-foreground">
            {metrics.earnedCredits}/{metrics.requiredCredits}
          </span>
        )}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <Skeleton className="h-3 w-full" />
          ) : (
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-muted"
              aria-label="Graduation progress bar"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${metrics.graduationPercent}%` }}
              />
            </div>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="h-4 w-12" />
        ) : (
          <span className="shrink-0 text-sm text-muted-foreground">
            {formatGraduationPercent(metrics.graduationPercent)}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
