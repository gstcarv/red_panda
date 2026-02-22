import { CoursesFilter, CoursesList } from '@/components/courses';
import { PageTitle } from '@/components/ui/page-title';
import { useCourses } from '@/hooks/courses/use-courses';
import { useExploreCoursesFilterStore } from '@/stores/explore-courses-filter-store';

export function ExploreCourses() {
  const filter = useExploreCoursesFilterStore((state) => state.filter);
  const setFilter = useExploreCoursesFilterStore((state) => state.setFilter);

  const { courses, isLoading, isError, refetch } = useCourses(filter);

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
          courses={courses}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </section>
    </div>
  );
}
