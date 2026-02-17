import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PageTitleProps {
  /** Main heading text */
  title: string;
  /** Optional short description below the title */
  description?: string;
  /** Optional right-side action (e.g. button) */
  action?: ReactNode;
  className?: string;
}

export function PageTitle({
  title,
  description,
  action,
  className,
}: PageTitleProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6',
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-2 shrink-0 sm:mt-0">{action}</div> : null}
    </header>
  );
}
