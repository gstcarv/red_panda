import { Clock, User } from 'lucide-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { EnrollmentActionButton } from '@/components/courses/enrollment-action-button';
import type { CourseSection, Course } from '@/types/course.type';
import { cn } from '@/lib/utils';
import { useCheckEnrollmentEligibility } from '@/hooks/enrollments/use-check-enrollment-eligibility';

dayjs.extend(customParseFormat);

export interface CourseSectionListProps {
  courseId: number | null;
  course: Course;
  sections: CourseSection[];
  enrolledSections?: CourseSection[];
  showEnrollmentAction?: boolean;
  onEnrollSuccess?: () => void;
}

function formatDayOfWeek(dayOfWeek: string): string {
  const dayIndex = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ].indexOf(dayOfWeek);

  if (dayIndex === -1) return dayOfWeek;

  return dayjs('2000-01-02').add(dayIndex, 'day').format('ddd');
}

function formatTime(time: string): string {
  const parsedTime = dayjs(time, 'HH:mm', true);
  return parsedTime.isValid() ? parsedTime.format('h:mm A') : time;
}

export function CourseSectionList({
  courseId,
  course,
  sections,
  enrolledSections = [],
  showEnrollmentAction = true,
  onEnrollSuccess,
}: CourseSectionListProps) {
  const { evaluate } = useCheckEnrollmentEligibility();
  const { eligible, validation } = evaluate(course);
  const enrolledSectionIds = new Set(enrolledSections.map((s) => s.id));
  const [containerRef] = useAutoAnimate({ duration: 300 });

  if (sections.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No sections available for this course.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-2">
      {sections.map((section) => {
        const isFull = section.enrolledCount >= section.capacity;
        const isEnrolled = enrolledSectionIds.has(section.id);

        return (
          <div
            key={section.id}
            className={cn(
              'flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors',
              isEnrolled ? 'border-purple-500 dark:border-purple-600' : 'border-border',
              'hover:bg-muted/50',
            )}
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium truncate">{section.teacher.name}</span>
              </div>
              <div className="space-y-0.5 pl-5">
                {section.meetingTimes.map((meeting, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>
                      {formatDayOfWeek(meeting.dayOfWeek)} {formatTime(meeting.startTime)}-
                      {formatTime(meeting.endTime)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {showEnrollmentAction ? (
              <div className="flex items-center gap-2 shrink-0">
                <EnrollmentActionButton
                  courseId={courseId}
                  sectionId={section.id}
                  isFull={isFull}
                  eligible={eligible}
                  validation={validation}
                  onEnrollSuccess={onEnrollSuccess}
                  confirmTitle="Unenroll from section?"
                  confirmDescription="This action will remove your enrollment from this section."
                  className="h-8 px-3 text-xs"
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
