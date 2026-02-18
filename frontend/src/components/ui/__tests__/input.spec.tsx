import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders with expected value and type', () => {
    render(<Input aria-label="Email" type="email" defaultValue="a@b.com" />);

    const input = screen.getByLabelText('Email') as HTMLInputElement;

    expect(input.value).toBe('a@b.com');
    expect(input.type).toBe('email');
  });
});
