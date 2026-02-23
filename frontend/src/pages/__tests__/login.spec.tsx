import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import type { FormEvent } from 'react';
import { Login } from '@/pages/login';
import { useLogin } from '@/hooks/auth/use-login';
import { useAuthStore } from '@/stores/auth-store';
import { useValidLoginUsers } from '@/hooks/auth/use-valid-login-users';
import { useErrorHandler } from '@/hooks/use-error-handler';

const navigateMock = mockFn<(path: string, options?: { replace?: boolean }) => void>();
const mutateMock = mockFn<(params: { email: string }) => void>();
const setAuthMock = mockFn<(payload: unknown) => void>();
const notifyErrorMock = mockFn<(error: unknown, message?: string) => void>();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...original,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/hooks/auth/use-login', () => ({
  useLogin: vi.fn(),
}));

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/hooks/auth/use-valid-login-users', () => ({
  useValidLoginUsers: vi.fn(),
}));

vi.mock('@/hooks/use-error-handler', () => ({
  useErrorHandler: vi.fn(),
}));

vi.mock('@/components/auth/valid-users-dialog', () => ({
  ValidUsersDialog: ({
    users,
    onSelectUser,
  }: {
    users: string[];
    onSelectUser: (email: string) => void;
  }) => (
    <div>
      <p data-testid="users-count">users:{users.length}</p>
      <button type="button" onClick={() => onSelectUser('picked@student.edu')}>
        Pick user
      </button>
    </div>
  ),
}));

vi.mock('@/components/auth/login-email-form', () => ({
  LoginEmailForm: ({
    email,
    emailError,
    shouldShowEmailError,
    onEmailChange,
    onEmailBlur,
    onSubmit,
  }: {
    email: string;
    emailError: string | null;
    shouldShowEmailError: boolean;
    onEmailChange: (value: string) => void;
    onEmailBlur: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  }) => (
    <div>
      <p data-testid="email-value">email:{email}</p>
      {shouldShowEmailError ? <p>{emailError}</p> : null}
      <button type="button" onClick={() => onEmailChange('  USER@SCHOOL.EDU ')}>
        Change email
      </button>
      <button type="button" onClick={onEmailBlur}>
        Blur email
      </button>
      <button
        type="button"
        onClick={() =>
          onSubmit({
            preventDefault: () => undefined,
          } as FormEvent<HTMLFormElement>)
        }
      >
        Submit form
      </button>
    </div>
  ),
}));

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useValidLoginUsers).mockReturnValue(['one@student.edu', 'two@student.edu']);
    vi.mocked(useErrorHandler).mockReturnValue({
      notifyError: notifyErrorMock,
      getErrorMessage: mockFn<(error: unknown) => string>(),
    } as never);
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({ setAuth: setAuthMock } as never),
    );
    vi.mocked(useLogin).mockImplementation(
      () =>
        ({
          mutate: mutateMock,
          isPending: false,
        }) as never,
    );
  });

  it('fills email when user is selected and submits normalized email', async () => {
    const user = userEvent.setup();

    render(<Login />);

    await user.click(screen.getByRole('button', { name: 'Pick user' }));
    await user.click(screen.getByRole('button', { name: 'Change email' }));
    await user.click(screen.getByRole('button', { name: 'Submit form' }));

    expect(screen.getByTestId('users-count')).toHaveTextContent('users:2');

    expect(screen.getByTestId('email-value')).toHaveTextContent('email: USER@SCHOOL.EDU');

    expect(mutateMock).toHaveBeenCalledWith({
      email: 'user@school.edu',
    });
  });

  it('blocks submit with invalid email and shows validation error', async () => {
    const user = userEvent.setup();

    render(<Login />);
    await user.click(screen.getByRole('button', { name: 'Submit form' }));

    expect(mutateMock).not.toHaveBeenCalled();

    expect(screen.getByText('Email is required.')).toBeInTheDocument();
  });

  it('handles login success and error callbacks', () => {
    render(<Login />);

    const options = vi.mocked(useLogin).mock.calls[0]?.[0];
    const successResponse = {
      token: 'token-1',
      expiresIn: 1000,
      email: 'student@school.edu',
      userId: 1,
    };

    options?.onSuccess?.(
      successResponse as never,
      { email: 'student@school.edu' },
      undefined,
      undefined as never,
    );
    options?.onError?.(
      new Error('bad login'),
      { email: 'student@school.edu' },
      undefined,
      undefined as never,
    );

    expect(setAuthMock).toHaveBeenCalledWith(successResponse);

    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });

    expect(notifyErrorMock).toHaveBeenCalledTimes(1);
  });
});
