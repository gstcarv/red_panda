import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar } from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Painel', icon: LayoutDashboard },
  { to: '/courses', label: 'Explore Courses', icon: BookOpen },
  { to: '/schedule', label: 'Schedule', icon: Calendar },
] as const;

export interface NavTabsProps {
  onLinkClick?: () => void;
  className?: string;
  variant?: 'horizontal' | 'vertical';
  disabledPaths?: ReadonlyArray<string>;
}

export function NavTabs({
  onLinkClick,
  className,
  variant = 'horizontal',
  disabledPaths = [],
}: NavTabsProps) {
  const location = useLocation();
  const isVertical = variant === 'vertical';

  return (
    <nav
      className={cn(
        'flex items-center gap-6 overflow-y-hidden overflow-x-auto',
        isVertical && 'flex-col items-stretch gap-0',
        className,
      )}
      aria-label="Main navigation"
      style={{
        scrollbarWidth: 'none',
      }}
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;
        const isDisabled = disabledPaths.includes(to);

        if (isDisabled) {
          return (
            <button
              key={to}
              type="button"
              disabled
              className={cn(
                'flex items-center gap-2 text-sm font-medium whitespace-nowrap opacity-50 cursor-not-allowed',
                isVertical ? 'rounded-md px-4 py-3' : 'rounded-none pb-3 -mb-px',
              )}
              aria-label={`${label} (disabled)`}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </button>
          );
        }

        return (
          <Link
            key={to}
            to={to}
            onClick={onLinkClick}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors duration-150 whitespace-nowrap',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              isVertical
                ? 'rounded-md px-4 py-3'
                : 'rounded-none pb-3 border-b-2 border-transparent -mb-px',
              isVertical
                ? isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                : isActive
                  ? 'text-(--nav-active) border-(--nav-active)'
                  : 'text-(--nav-inactive) hover:text-foreground border-transparent',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
