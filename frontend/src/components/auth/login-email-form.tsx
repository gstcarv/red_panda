import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type LoginEmailFormProps = {
  email: string;
  emailError: string | null;
  shouldShowEmailError: boolean;
  isPending: boolean;
  onEmailChange: (value: string) => void;
  onEmailBlur: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function LoginEmailForm({
  email,
  emailError,
  shouldShowEmailError,
  isPending,
  onEmailChange,
  onEmailBlur,
  onSubmit,
}: LoginEmailFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          onBlur={onEmailBlur}
          autoComplete="email"
          aria-invalid={shouldShowEmailError}
          aria-describedby={shouldShowEmailError ? 'email-error' : undefined}
        />
        {shouldShowEmailError ? (
          <p id="email-error" className="text-sm text-destructive">
            {emailError}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Continue'}
      </Button>
    </form>
  );
}
