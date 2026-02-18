import {
  CoursesFilter,
  CoursesList,
  type CoursesFilterValues,
} from '@/components/courses';
import { PageTitle } from '@/components/ui/page-title';
import { useCourses } from '@/hooks/courses/use-courses';
import type { Course } from '@/types/course.type';
import { useCallback, useState } from 'react';
import { FeedbackDialog } from '@/components/ui/feedback-dialog';
import { useCourseById } from '@/hooks/courses/use-course-by-id';
import { useEnrollmentFlow } from '@/hooks/enrollments/use-enrollment-flow';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { toast } from 'sonner';

const DEFAULT_FILTER: CoursesFilterValues = {
  search: '',
  onlyEligible: false,
};

export function ExploreCourses() {
  const [filter, setFilter] = useState<CoursesFilterValues>(DEFAULT_FILTER);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [enrolledCourseName, setEnrolledCourseName] = useState('');

  const { data, isLoading, isError, refetch } = useCourses();
  const { data: courseData } = useCourseById(selectedCourseId);
  const { notifyError } = useErrorHandler();

  const {
    enrollInSection,
    unenrollFromSection,
    enrollingSectionId,
    unenrollingSectionId,
    isSectionEnrolled,
  } =
    useEnrollmentFlow(selectedCourseId, {
      onSuccess: () => {
        setEnrolledCourseName(courseData?.data.name ?? 'the course');
        setShowSuccessDialog(true);
        setSelectedCourseId(null);
      },
      onError: (error) => {
        notifyError(error, 'Failed to enroll. Please try again.');
      },
    });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- placeholder until eligibility from API
  const getEligible = useCallback((_course: Course) => false, []);

  const handleEnrollSection = useCallback(
    (sectionId: number) => {
      if (!selectedCourseId) {
        toast.error('No course selected');
        return;
      }

      enrollInSection(sectionId);
    },
    [enrollInSection, selectedCourseId],
  );

  const handleUnenrollSection = useCallback(
    (sectionId: number) => {
      unenrollFromSection(sectionId);
    },
    [unenrollFromSection],
  );

  const handleCourseSelect = useCallback((courseId: number) => {
    setSelectedCourseId(courseId);
  }, []);

  const handleModalClose = useCallback((open: boolean) => {
    if (!open) {
      setSelectedCourseId(null);
    }
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
          courses={data?.data.courses ?? []}
          getEligible={getEligible}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          onEnrollSection={handleEnrollSection}
          onUnenrollSection={handleUnenrollSection}
          enrollingSectionId={enrollingSectionId}
          unenrollingSectionId={unenrollingSectionId}
          isSectionEnrolled={isSectionEnrolled}
          selectedCourseId={selectedCourseId}
          onCourseSelect={handleCourseSelect}
          onModalClose={handleModalClose}
        />
      </section>

      <FeedbackDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        variant="success"
        title="Enrollment Successful!"
        description={`You have successfully enrolled in ${enrolledCourseName}.`}
        onConfirm={() => setShowSuccessDialog(false)}
      />
    </div>
  );
}
