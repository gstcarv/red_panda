import {
  CoursesFilter,
  CoursesList,
  type CoursesFilterValues,
} from '@/components/courses';
import { PageTitle } from '@/components/ui/page-title';
import { useCourses } from '@/hooks/courses/use-courses';
import type { Course } from '@/types/course.type';
import { useCallback, useState } from 'react';

const DEFAULT_FILTER: CoursesFilterValues = {
  search: '',
  onlyEligible: false,
};

export function ExploreCourses() {
  const [filter, setFilter] = useState<CoursesFilterValues>(DEFAULT_FILTER);

  const { data, isLoading, isError, refetch } = useCourses();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- placeholder until eligibility from API
  const getEligible = useCallback((_course: Course) => false, []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <PageTitle
        title="Explore Courses"
        description="Check the courses available for the semester."
      />
      <section aria-label="Filter courses">
        <CoursesFilter value={filter} onChange={setFilter} />
      </section>

      <section aria-label="Courses list">
        <CoursesList
          courses={data?.data.courses ?? []}
          getEligible={getEligible}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </section>
    </div>
  );
}
