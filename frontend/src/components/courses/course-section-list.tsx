import { Clock, Users, User } from 'lucide-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Badge } from '@/components/ui/badge';
import { EnrollmentActionButton } from '@/components/courses/enrollment-action-button';
import type { CourseSection } from '@/types/course.type';
import { cn } from '@/lib/utils';

dayjs.extend(customParseFormat);

export interface CourseSectionListProps {
  sections: CourseSection[];
  onEnroll?: (sectionId: number) => void;
  onUnenroll?: (sectionId: number) => void;
  enrollingSectionId?: number | null;
  unenrollingSectionId?: number | null;
  isSectionEnrolled?: (sectionId: number) => boolean;
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
  sections,
  onEnroll,
  onUnenroll,
  enrollingSectionId = null,
  unenrollingSectionId = null,
  isSectionEnrolled,
}: CourseSectionListProps) {
  function getEnrollButtonLabel(
    isEnrolling: boolean,
    alreadyEnrolled: boolean,
    isFull: boolean,
  ): string {
    if (isEnrolling) return 'Enrolling...';
    if (alreadyEnrolled) return 'Enrolled';
    if (isFull) return 'Full';
    return 'Enroll';
  }

  if (sections.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No sections available for this course.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sections.map((section) => {
        const isEnrolling = enrollingSectionId === section.id;
        const isUnenrolling = unenrollingSectionId === section.id;
        const isFull = section.enrolledCount >= section.capacity;
        const alreadyEnrolled = isSectionEnrolled?.(section.id) ?? false;
        const spotsAvailable = section.capacity - section.enrolledCount;

        return (
          <div
            key={section.id}
            className={cn(
              'flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors',
              'hover:bg-muted/50',
            )}
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium truncate">
                  {section.teacher.name}
                </span>
              </div>
              <div className="space-y-0.5 pl-5">
                {section.meetingTimes.map((meeting, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 text-xs text-muted-foreground"
                  >
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>
                      {formatDayOfWeek(meeting.dayOfWeek)}{' '}
                      {formatTime(meeting.startTime)}-
                      {formatTime(meeting.endTime)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pl-5">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>
                    {section.enrolledCount}/{section.capacity}
                  </span>
                </div>
                {isFull ? (
                  <Badge variant="destructive" className="text-xs h-5 px-1.5">
                    Full
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                    {spotsAvailable} spot{spotsAvailable !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {alreadyEnrolled && onUnenroll ? (
                <EnrollmentActionButton
                  isEnrolled
                  isPending={isUnenrolling || isEnrolling}
                  onUnenroll={() => onUnenroll(section.id)}
                  confirmTitle="Unenroll from section?"
                  confirmDescription="This action will remove your enrollment from this section."
                  className="h-8 px-3 text-xs"
                />
              ) : onEnroll ? (
                <EnrollmentActionButton
                  isEnrolled={false}
                  isPending={isEnrolling}
                  isFull={isFull}
                  onEnroll={() => onEnroll(section.id)}
                  enrollLabel={getEnrollButtonLabel(
                    isEnrolling,
                    alreadyEnrolled,
                    isFull,
                  )}
                  className="h-8 px-3 text-xs"
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
