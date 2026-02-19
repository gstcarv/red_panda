import { useMemo } from 'react';
import { CourseStudentStatusTag } from '@/components/courses/course-student-status-tag';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { CourseHistoryCardProps } from './types';

export function CourseHistoryCard({
  isLoading,
  history,
  metrics,
  onCourseClick,
}: CourseHistoryCardProps) {
  const groupedHistory = useMemo(() => {
    const grouped = new Map<
      string,
      { semesterLabel: string; semesterOrder: number; items: typeof history }
    >();

    for (const item of history) {
      const semesterKey = `${item.semester.year}-${item.semester.order_in_year}`;
      const semesterLabel = `${item.semester.name} ${item.semester.year}`;
      const semesterOrder = item.semester.year * 10 + item.semester.order_in_year;

      const currentGroup = grouped.get(semesterKey);
      if (!currentGroup) {
        grouped.set(semesterKey, {
          semesterLabel,
          semesterOrder,
          items: [item],
        });
        continue;
      }

      currentGroup.items.push(item);
    }

    return [...grouped.entries()]
      .sort((a, b) => b[1].semesterOrder - a[1].semesterOrder)
      .map(([key, value]) => ({
        key,
        ...value,
      }));
  }, [history]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course History</CardTitle>
        <CardDescription>
          {isLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            `${metrics.passedCount} passed, ${metrics.failedCount} failed`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No historical courses found yet.
          </p>
        ) : (
          <>
            <Accordion
              key={groupedHistory.map((group) => group.key).join('|')}
              type="multiple"
              className="w-full"
            >
              {groupedHistory.map((group) => {
                const passedCount = group.items.filter(
                  (course) => course.status === 'passed',
                ).length;
                const failedCount = group.items.length - passedCount;

                return (
                <AccordionItem
                  key={group.key}
                  value={group.key}
                  className="mb-2 border-none last:mb-0"
                >
                  <AccordionTrigger
                    className="rounded-lg border border-border bg-muted/35 px-4 py-3 hover:bg-muted/55 hover:no-underline data-[state=open]:bg-muted/65"
                  >
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {group.semesterLabel}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {group.items.length}{' '}
                          {group.items.length === 1 ? 'course' : 'courses'}
                        </p>
                      </div>
                      <div
                        className="hidden items-center gap-2 sm:flex"
                        aria-hidden="true"
                      >
                        <Badge
                          variant="outline"
                          className="border-emerald-200/70 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300"
                        >
                          {passedCount} passed
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-rose-200/70 bg-rose-500/10 text-rose-700 dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-300"
                        >
                          {failedCount} failed
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <div className="space-y-3">
                      {group.items.map((item) => {
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onCourseClick?.(item.courseId)}
                            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <div className="min-w-0">
                              <span className="truncate text-left text-sm font-medium text-foreground">
                                {item.courseName}
                              </span>
                            </div>
                            <CourseStudentStatusTag status={item.status} />
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                );
              })}
            </Accordion>
          </>
        )}
      </CardContent>
    </Card>
  );
}
