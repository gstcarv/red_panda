import { Clock, Users, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CourseSection } from '@/types/course.type';
import { cn } from '@/lib/utils';

export interface CourseSectionListProps {
  sections: CourseSection[];
  onEnroll?: (sectionId: number) => void;
  enrollingSectionId?: number | null;
}

const dayAbbreviations: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function CourseSectionList({
  sections,
  onEnroll,
  enrollingSectionId = null,
}: CourseSectionListProps) {
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
        const isFull = section.enrolledCount >= section.capacity;
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
                      {dayAbbreviations[meeting.dayOfWeek] || meeting.dayOfWeek}{' '}
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
              {onEnroll && (
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => onEnroll(section.id)}
                  disabled={isFull || isEnrolling}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  {isEnrolling ? 'Enrolling...' : isFull ? 'Full' : 'Enroll'}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
