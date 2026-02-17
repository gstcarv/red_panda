import { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export interface CoursesFilterValues {
  search: string;
  onlyEligible: boolean;
}

export interface CoursesFilterProps {
  value: CoursesFilterValues;
  onChange: (value: CoursesFilterValues) => void;
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

  const handleEligibleChange = useCallback(
    (checked: boolean) => {
      onChange({ ...value, onlyEligible: checked });
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

        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
          <label className="flex cursor-pointer items-center gap-2.5 whitespace-nowrap">
            <Switch
              checked={value.onlyEligible}
              onCheckedChange={handleEligibleChange}
              aria-label="Only courses I'm eligible for"
            />
            <span className="text-sm text-muted-foreground">
              Only courses I'm eligible
            </span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
