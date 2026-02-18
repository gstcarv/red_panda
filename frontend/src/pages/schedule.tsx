import { ScheduleCalendar, SchedulerList } from '@/components/schedule';
import { PageTitle } from '@/components/ui/page-title';
import { useSchedulerEnrollments } from '@/hooks/enrollments/use-scheduler-enrollments';
import { useState } from 'react';

export function Schedule() {
  const { events } = useSchedulerEnrollments();
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8">
      <section className="flex flex-col gap-4 sm:gap-5">
        <PageTitle
          title="Schedule"
          description="Your schedule for the current semester."
        />
        <SchedulerList onCourseHoverChange={setActiveCourseId} />
      </section>

      <section
        aria-label="Weekly calendar"
        className="lg:sticky lg:top-6 lg:self-start"
      >
        <ScheduleCalendar events={events} activeCourseId={activeCourseId} />
      </section>
    </div>
  );
}
