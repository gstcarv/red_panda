import { useState } from 'react';
import { LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type EnrollmentActionButtonProps = {
  isEnrolled: boolean;
  isPending?: boolean;
  isFull?: boolean;
  onEnroll?: () => void;
  onUnenroll?: () => void;
  enrollLabel?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmButtonLabel?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
};

export function EnrollmentActionButton({
  isEnrolled,
  isPending = false,
  isFull = false,
  onEnroll,
  onUnenroll,
  enrollLabel = 'Enroll',
  confirmTitle = 'Unenroll from section?',
  confirmDescription = 'This action will remove your enrollment from this section.',
  confirmButtonLabel = 'Confirm unenroll',
  className,
  size = 'sm',
}: EnrollmentActionButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (isEnrolled) {
    if (!onUnenroll) {
      return (
        <Button
          type="button"
          variant="outline"
          size={size}
          className={className}
          disabled
        >
          Enrolled
        </Button>
      );
    }

    return (
      <>
        <Button
          type="button"
          variant="outline"
          size={size}
          className={className}
          onClick={() => setIsConfirmOpen(true)}
          disabled={isPending}
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          {isPending ? 'Unenrolling...' : 'Unenroll'}
        </Button>
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{confirmTitle}</DialogTitle>
              <DialogDescription>{confirmDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onUnenroll();
                  setIsConfirmOpen(false);
                }}
                disabled={isPending}
              >
                <LogOut className="size-4" aria-hidden />
                {isPending ? 'Unenrolling...' : confirmButtonLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Button
      type="button"
      variant="default"
      size={size}
      className={className}
      onClick={onEnroll}
      disabled={isFull || isPending || !onEnroll}
    >
      <Plus className="h-3.5 w-3.5 mr-1.5" />
      {isPending ? 'Enrolling...' : isFull ? 'Full' : enrollLabel}
    </Button>
  );
}
