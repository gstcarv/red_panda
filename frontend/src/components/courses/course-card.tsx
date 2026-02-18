import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import type { Course } from '@/types/course.type';

export interface CourseCardProps {
  course: Course;
  /** Passed from parent; badge is always shown (Eligible / Not eligible) */
  eligible?: boolean;
  onClick?: (courseId: number) => void;
  className?: string;
}

export function CourseCard({
  course,
  eligible = false,
  onClick,
  className,
}: CourseCardProps) {
  return (
    <Card
      className={cn(
        'flex h-full flex-col gap-0 py-0 transition-shadow hover:shadow-md content-visibility-auto contain-intrinsic-size-[0_300px]',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={() => onClick?.(course.id)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(course.id);
        }
      }}
    >
      <article className="contents">
        <CardHeader className="flex flex-row items-start justify-between gap-3 pt-6 pb-2">
          <div className="min-w-0 space-y-1">
            <h3 className="text-lg font-semibold leading-tight tracking-tight text-card-foreground">
              {course.name}
            </h3>
            <p className="text-sm text-muted-foreground">{course.code}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {course.hoursPerWeek}h/week
              </span>
              <span className="text-xs text-muted-foreground">
                Grades {course.gradeLevel.min}–{course.gradeLevel.max}
              </span>
            </div>
          </div>
          <Badge
            variant={eligible ? 'default' : 'secondary'}
            className={cn(
              'shrink-0 gap-1',
              !eligible && 'bg-muted text-muted-foreground',
            )}
            aria-label={eligible ? 'Eligible' : 'Not eligible'}
          >
            {eligible ? (
              <CheckCircle2 className="size-3" aria-hidden />
            ) : (
              <XCircle className="size-3" aria-hidden />
            )}
            {eligible ? 'Eligible' : 'Not eligible'}
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 pb-4">
          {course.prerequisite != null ? (
            <p className="text-sm text-muted-foreground">
              Prerequisite: {course.prerequisite.name}
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4 border-t border-border pt-4 pb-6">
          <span className="text-sm text-muted-foreground">
            {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
          </span>
        </CardFooter>
      </article>
    </Card>
  );
}
