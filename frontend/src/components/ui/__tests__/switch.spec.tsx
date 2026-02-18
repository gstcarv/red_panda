import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { Switch } from '@/components/ui/switch';

describe('Switch', () => {
  it('calls onCheckedChange with toggled value', async () => {
    const user = userEvent.setup();
    const onCheckedChange = mockFn<(checked: boolean) => void>();

    render(<Switch checked={false} onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('switch'));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
