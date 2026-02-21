import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginEmailForm } from '@/components/auth/login-email-form';
import { ValidUsersDialog } from '@/components/auth/valid-users-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useValidLoginUsers } from '@/hooks/auth/use-valid-login-users';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useLogin } from '@/hooks/auth/use-login';
import { useAuthStore } from '@/stores/auth-store';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasTouchedEmail, setHasTouchedEmail] = useState(false);
  const validUsers = useValidLoginUsers();
  const { notifyError } = useErrorHandler();
  const setAuth = useAuthStore((state) => state.setAuth);

  const normalizedEmail = email.trim().toLowerCase();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const emailError =
    normalizedEmail.length === 0
      ? 'Email is required.'
      : !isEmailValid
        ? 'Please enter a valid email address (example: you@example.com).'
        : null;
  const shouldShowEmailError =
    (hasTouchedEmail || hasSubmitted) && !!emailError;

  const { mutate, isPending } = useLogin({
    onSuccess: (response) => {
      setAuth(response.data);
      navigate('/', { replace: true });
    },
    onError: (error) => {
      notifyError(error, 'Unable to login with this email.');
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (emailError) {
      return;
    }

    mutate({ email: normalizedEmail });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--page-background) px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Login</CardTitle>
            <ValidUsersDialog
              users={validUsers}
              onSelectUser={(selectedEmail) => {
                setEmail(selectedEmail);
                setHasTouchedEmail(true);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <LoginEmailForm
            email={email}
            emailError={emailError}
            shouldShowEmailError={shouldShowEmailError}
            isPending={isPending}
            onEmailChange={setEmail}
            onEmailBlur={() => setHasTouchedEmail(true)}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </main>
  );
}
