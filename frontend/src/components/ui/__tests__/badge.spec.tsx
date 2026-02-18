import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders content and slot metadata', () => {
    render(<Badge>Eligible</Badge>);

    expect(screen.getByText('Eligible')).toHaveAttribute('data-slot', 'badge');
  });
});
