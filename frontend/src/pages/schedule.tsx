import { ScheduleCalendar, SchedulerList } from '@/components/schedule';
import { PageTitle } from '@/components/ui/page-title';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useEnrollmentFlow } from '@/hooks/enrollments/use-enrollment-flow';
import { useSchedulerEnrollments } from '@/hooks/enrollments/use-scheduler-enrollments';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useMemo, useState } from 'react';
import type { EnrolledCourseItem } from '@/components/schedule/scheduler-list';

export function Schedule() {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { events } = useSchedulerEnrollments();
  const { data: enrollmentsResponse } = useEnrollments();
  const { notifyError } = useErrorHandler();
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const {
    enrollInSection,
    unenrollFromSection,
    enrollingSectionId,
    unenrollingSectionId,
    isSectionEnrolled,
  } = useEnrollmentFlow(selectedCourseId, {
    onError: (error) => {
      notifyError(error, 'Failed to update enrollment. Please try again.');
    },
    onUnenrollSuccess: () => {
      setActiveCourseId(null);
    },
  });
  
  const enrolledCourses = useMemo<EnrolledCourseItem[]>(() => {
    const enrollments = enrollmentsResponse?.data.enrollments ?? [];
    const coursesById = new Map<number, EnrolledCourseItem>();

    for (const enrollment of enrollments) {
      coursesById.set(enrollment.course.id, {
        enrollmentId: enrollment.id,
        course: enrollment.course,
      });
    }

    return Array.from(coursesById.values());
  }, [enrollmentsResponse]);
  const unenrollingEnrollmentId = useMemo(() => {
    if (unenrollingSectionId === null) {
      return null;
    }

    const enrollments = enrollmentsResponse?.data.enrollments ?? [];
    const enrollment = enrollments.find(
      (item) => item.courseSection.id === unenrollingSectionId,
    );

    return enrollment?.id ?? null;
  }, [enrollmentsResponse, unenrollingSectionId]);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8">
      <section className="flex flex-col gap-4 sm:gap-5">
        <PageTitle
          title="Schedule"
          description="Your schedule for the current semester."
        />
        <SchedulerList
          enrolledCourses={enrolledCourses}
          isLoading={!enrollmentsResponse}
          unenrollingEnrollmentId={unenrollingEnrollmentId}
          onUnenroll={(enrollmentId) => {
            const enrollments = enrollmentsResponse?.data.enrollments ?? [];
            const sectionId = enrollments.find(
              (item) => item.id === enrollmentId,
            )?.courseSection.id;

            if (!sectionId) {
              return;
            }

            unenrollFromSection(sectionId);
          }}
          onCourseHoverChange={setActiveCourseId}
        />
      </section>

      <section
        aria-label="Weekly calendar"
        className="lg:sticky lg:top-6 lg:self-start"
      >
        <ScheduleCalendar
          events={events}
          activeCourseId={activeCourseId}
          selectedCourseId={selectedCourseId}
          onCourseEventSelect={setSelectedCourseId}
          onCourseDetailsOpenChange={(open) => {
            if (!open) {
              setSelectedCourseId(null);
            }
          }}
          onEnrollSection={enrollInSection}
          onUnenrollSection={unenrollFromSection}
          enrollingSectionId={enrollingSectionId}
          unenrollingSectionId={unenrollingSectionId}
          isSectionEnrolled={isSectionEnrolled}
        />
      </section>
    </div>
  );
}
