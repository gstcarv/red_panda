import { useMemo, useState, useCallback } from 'react';
import { PageTitle } from '@/components/ui/page-title';
import {
  CoursesFilter,
  CoursesList,
  type CoursesFilterValues,
} from '@/components/courses';
import type { Course } from '@/types/course.type';

const courses: Course[] = [];

const DEFAULT_FILTER: CoursesFilterValues = {
  search: '',
  onlyEligible: false,
};

function filterCourses(
  courses: Course[],
  filter: CoursesFilterValues,
  getEligible: (course: Course) => boolean,
): Course[] {
  let result = courses;
  const searchLower = filter.search.trim().toLowerCase();
  if (searchLower) {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.code.toLowerCase().includes(searchLower),
    );
  }
  if (filter.onlyEligible) {
    result = result.filter((c) => getEligible(c));
  }
  return result;
}

export function ExploreCourses() {
  const [filter, setFilter] = useState<CoursesFilterValues>(DEFAULT_FILTER);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  const getEligible = useCallback(() => false, []);

  const filteredCourses = useMemo(
    () => filterCourses(courses, filter, getEligible),
    [filter, getEligible],
  );

  const handleEnroll = useCallback((courseId: number) => {
    setEnrollingId(courseId);
    setTimeout(() => setEnrollingId(null), 800);
  }, []);

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
          onEnroll={handleEnroll}
          enrollingId={enrollingId}
        />
      </section>
    </div>
  );
}
