import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { ValidUsersDialog } from '@/components/auth/valid-users-dialog';

describe('ValidUsersDialog', () => {
  it('opens dialog and selects a user email', async () => {
    const user = userEvent.setup();
    const onSelectUser = mockFn<(email: string) => void>();

    render(
      <ValidUsersDialog
        users={['first@student.edu', 'second@student.edu']}
        onSelectUser={onSelectUser}
      />,
    );

    await user.click(screen.getByRole('button', { name: /show valid users/i }));
    await user.click(screen.getByRole('button', { name: 'second@student.edu' }));

    expect(onSelectUser).toHaveBeenCalledTimes(1);

    expect(onSelectUser).toHaveBeenCalledWith('second@student.edu');
  });

  it('shows empty state when no users are provided', async () => {
    const user = userEvent.setup();

    render(<ValidUsersDialog users={[]} onSelectUser={mockFn<(email: string) => void>()} />);

    await user.click(screen.getByRole('button', { name: /show valid users/i }));

    expect(screen.getByText('No valid users available.')).toBeInTheDocument();
  });
});
