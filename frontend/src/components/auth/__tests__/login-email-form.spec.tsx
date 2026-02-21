import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { LoginEmailForm } from '@/components/auth/login-email-form';

describe('LoginEmailForm', () => {
  it('submits the form with user interaction callbacks', async () => {
    const user = userEvent.setup();
    const onSubmit = mockFn<(event: React.FormEvent<HTMLFormElement>) => void>();
    const onEmailChange = mockFn<(value: string) => void>();
    const onEmailBlur = mockFn<() => void>();

    render(
      <LoginEmailForm
        email=""
        emailError={null}
        shouldShowEmailError={false}
        isPending={false}
        onEmailChange={onEmailChange}
        onEmailBlur={onEmailBlur}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText('Email'), 'user@student.edu');
    await user.tab();
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onEmailChange).toHaveBeenCalled();

    expect(onEmailBlur).toHaveBeenCalledTimes(1);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows inline email error when provided', () => {
    render(
      <LoginEmailForm
        email="wrong-email"
        emailError="Please enter a valid email."
        shouldShowEmailError
        isPending={false}
        onEmailChange={mockFn<(value: string) => void>()}
        onEmailBlur={mockFn<() => void>()}
        onSubmit={mockFn<(event: React.FormEvent<HTMLFormElement>) => void>()}
      />,
    );

    expect(screen.getByText('Please enter a valid email.')).toBeInTheDocument();
  });
});
