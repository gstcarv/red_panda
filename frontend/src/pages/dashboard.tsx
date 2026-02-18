import { PageTitle } from '@/components/ui/page-title';
import { CourseSectionModal } from '@/components/courses/course-section-modal';
import {
  CourseHistoryCard,
  DashboardErrorState,
  DashboardSummaryCards,
  GraduationProgressCard,
} from '@/components/dashboard';
import { useCourseDetailsModal } from '@/hooks/courses/use-course-details-modal';
import { useDashboard } from '@/hooks/dashboard/use-dashboard';

export function Dashboard() {
  const { isLoading, isError, metrics, historyByMostRecent, retry } = useDashboard();
  const { selectedCourseId, modalOpen, handleCourseSelect, handleModalClose } =
    useCourseDetailsModal({});

  if (isError) {
    return (
      <section className="flex flex-col gap-4">
        <PageTitle
          title="Student Dashboard"
          description="Track your academic performance and graduation progress."
        />
        <DashboardErrorState onRetry={retry} />
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <PageTitle
        title="Student Dashboard"
        description="Track your GPA, credits and overall graduation progress."
      />

      <DashboardSummaryCards isLoading={isLoading} metrics={metrics} />

      <section
        aria-label="Graduation progress and course history"
        className="grid gap-4"
      >
        <GraduationProgressCard isLoading={isLoading} metrics={metrics} />
        <CourseHistoryCard
          isLoading={isLoading}
          history={historyByMostRecent}
          metrics={metrics}
          onCourseClick={handleCourseSelect}
        />
      </section>
      <CourseSectionModal
        courseId={selectedCourseId}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </div>
  );
}
