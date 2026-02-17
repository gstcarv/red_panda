import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NavTabs } from '@/components/layout/nav-tabs';

export interface BaseLayoutProps {
  children: ReactNode;
  /** Optional class name for the root wrapper */
  className?: string;
  /** Optional class name for the main content area */
  mainClassName?: string;
}

const SPACING = {
  pageX: 'px-4 sm:px-6 lg:px-8',
  pageY: 'py-6 sm:py-8',
} as const;

export function BaseLayout({
  children,
  className,
  mainClassName,
}: BaseLayoutProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen w-full min-w-0 flex-col bg-background',
        className,
      )}
    >
      <header className="shrink-0 flex flex-col bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-0 sm:py-5">
          <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="flex min-w-0 shrink-0 items-center gap-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/80 text-muted-foreground"
                aria-hidden
              >
                <span className="text-xs font-semibold">M</span>
              </div>
              <span className="truncate text-lg font-semibold tracking-tight text-foreground">
                Mapplewood
              </span>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden max-w-[120px] truncate text-sm text-foreground sm:inline-block">
              User Name
            </span>
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
              aria-hidden
            >
              <User className="size-4" />
            </div>
          </div>
        </div>

        <div className="nav-tabs-bar container mx-auto border-b border-border overflow-x-auto px-4 sm:px-0">
          <NavTabs />
        </div>
      </header>

      <main
        className={cn(
          'min-h-0 flex-1 bg-(--page-background)',
          SPACING.pageX,
          SPACING.pageY,
          mainClassName,
        )}
      >
        <div className="mx-auto w-full container">{children}</div>
      </main>
    </div>
  );
}
