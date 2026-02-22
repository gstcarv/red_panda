import { CircleHelp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ValidUsersDialogProps = {
  users: string[];
  onSelectUser: (email: string) => void;
};

export function ValidUsersDialog({ users, onSelectUser }: ValidUsersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Show valid users">
          <CircleHelp className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Valid users</DialogTitle>
          <DialogDescription>Select a user to fill the email field.</DialogDescription>
        </DialogHeader>
        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {users.map((email) => (
            <Button
              key={email}
              type="button"
              variant="outline"
              className="h-auto w-full justify-start py-2 text-left"
              onClick={() => {
                onSelectUser(email);
                setIsOpen(false);
              }}
            >
              <span className="text-sm">{email}</span>
            </Button>
          ))}

          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No valid users available.</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
