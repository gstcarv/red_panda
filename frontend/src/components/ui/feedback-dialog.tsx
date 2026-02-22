import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type FeedbackVariant = 'success' | 'info' | 'warning';

export interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: FeedbackVariant;
  title: string;
  description?: string;
  onConfirm?: () => void;
  confirmLabel?: string;
}

const variantConfig: Record<FeedbackVariant, { icon: typeof CheckCircle2; iconColor: string }> = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-green-600 dark:text-green-500',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-500',
  },
};

export function FeedbackDialog({
  open,
  onOpenChange,
  variant,
  title,
  description,
  onConfirm,
  confirmLabel = 'OK',
}: FeedbackDialogProps) {
  const { icon: Icon, iconColor } = variantConfig[variant];

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={cn('h-6 w-6 shrink-0', iconColor)} />
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && <DialogDescription className="pt-2">{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirm} variant="default">
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
