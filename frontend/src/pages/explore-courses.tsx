import {
  CoursesFilter,
  CoursesList,
} from '@/components/courses';
import { PageTitle } from '@/components/ui/page-title';
import { useCourses } from '@/hooks/courses/use-courses';
import { useFilteredExploreCourses } from '@/hooks/courses/use-filtered-explore-courses';
import { useExploreCoursesFilterStore } from '@/hooks/courses/use-explore-courses-filter-store';

export function ExploreCourses() {
  const filter = useExploreCoursesFilterStore((state) => state.filter);
  const setFilter = useExploreCoursesFilterStore((state) => state.setFilter);

  const { data, isLoading, isError, refetch } = useCourses();
  const courses = data?.data.courses ?? [];
  const { filteredCourses, getEligible, getCourseCardClassName } =
    useFilteredExploreCourses({
    courses,
    filter,
  });


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
          courses={filteredCourses}
          getEligible={getEligible}
          getCourseCardClassName={getCourseCardClassName}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </section>
    </div>
  );
}
