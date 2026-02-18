import { useMemo, useState } from 'react';
import { CourseStudentStatusTag } from '@/components/courses/course-student-status-tag';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import type { Course } from '@/types/course.type';
import type { CourseHistoryCardProps } from './types';

const INITIAL_VISIBLE_HISTORY_ITEMS = 4;

export function CourseHistoryCard({
  isLoading,
  history,
  metrics,
  onCourseClick,
}: CourseHistoryCardProps) {
  const [visibleItems, setVisibleItems] = useState(INITIAL_VISIBLE_HISTORY_ITEMS);

  const visibleHistory = useMemo(() => {
    return history.slice(0, visibleItems);
  }, [history, visibleItems]);

  const groupedHistory = useMemo(() => {
    const grouped = new Map<
      string,
      { semesterLabel: string; semesterOrder: number; items: typeof visibleHistory }
    >();

    for (const item of visibleHistory) {
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
  }, [visibleHistory]);

  const hasMoreItems = history.length > visibleItems;

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
              defaultValue={groupedHistory.map((group) => group.key)}
              className="w-full"
            >
              {groupedHistory.map((group) => (
                <AccordionItem key={group.key} value={group.key}>
                  <AccordionTrigger>
                    <span className="text-sm font-medium">{group.semesterLabel}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {group.items.map((item) => {
                        const historyCourse: Course = {
                          id: item.courseId,
                          code: String(item.courseId),
                          name: item.courseName,
                          credits: 0,
                          hoursPerWeek: 0,
                          gradeLevel: { min: 9, max: 12 },
                          availableSections: [],
                          semester: item.semester,
                        };

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
                            <CourseStudentStatusTag course={historyCourse} />
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {hasMoreItems ? (
              <Button
                type="button"
                variant="link"
                className="px-0"
                onClick={() =>
                  setVisibleItems((currentVisible) =>
                    Math.min(currentVisible + INITIAL_VISIBLE_HISTORY_ITEMS, history.length),
                  )
                }
              >
                See more
              </Button>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
