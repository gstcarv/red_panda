import { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  WEEKDAY_FILTER_OPTIONS,
  type ExploreCoursesFilterValues,
} from '@/stores/explore-courses-filter-store';

export interface CoursesFilterProps {
  value: ExploreCoursesFilterValues;
  onChange: (value: ExploreCoursesFilterValues) => void;
  className?: string;
}

export function CoursesFilter({
  value,
  onChange,
  className,
}: CoursesFilterProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, search: e.target.value });
    },
    [onChange, value],
  );

  const handleClearSearch = useCallback(() => {
    onChange({ ...value, search: '' });
  }, [onChange, value]);

  const handleFromTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, fromTime: e.target.value });
    },
    [onChange, value],
  );

  const handleUntilTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, untilTime: e.target.value });
    },
    [onChange, value],
  );

  const handleWeekdayToggle = useCallback(
    (day: string) => {
      const normalizedDay = day.trim().toLowerCase();
      const isSelected = value.weekdays.includes(normalizedDay);

      onChange({
        ...value,
        weekdays: isSelected
          ? value.weekdays.filter((weekday) => weekday !== normalizedDay)
          : [...value.weekdays, normalizedDay],
      });
    },
    [onChange, value],
  );

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 w-full min-w-0 lg:max-w-[50%]">
          <label
            htmlFor="courses-search"
            className="text-sm font-medium text-foreground"
          >
            Search
          </label>
          <div className="relative w-full">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="courses-search"
              type="search"
              placeholder="Search by name or code..."
              value={value.search}
              onChange={handleSearchChange}
              className="h-10 pl-9 pr-9 bg-background"
              aria-label="Search courses"
            />
            {value.search.length > 0 ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-4 md:flex-row md:items-end md:gap-4">
          <div className="grid w-fit gap-3 md:grid-cols-2">
            <div className="max-w-40 space-y-2">
              <label
                htmlFor="courses-from-time"
                className="text-sm font-medium text-foreground"
              >
                From time
              </label>
              <Input
                id="courses-from-time"
                type="time"
                value={value.fromTime}
                onChange={handleFromTimeChange}
                className="h-9"
                aria-label="From time"
              />
            </div>
            <div className="max-w-40 space-y-2">
              <label
                htmlFor="courses-until-time"
                className="text-sm font-medium text-foreground"
              >
                Until time
              </label>
              <Input
                id="courses-until-time"
                type="time"
                value={value.untilTime}
                onChange={handleUntilTimeChange}
                className="h-9"
                aria-label="Until time"
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Weekdays</p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_FILTER_OPTIONS.map((option) => {
                const isSelected = value.weekdays.includes(option.value);
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleWeekdayToggle(option.value)}
                    aria-pressed={isSelected}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
