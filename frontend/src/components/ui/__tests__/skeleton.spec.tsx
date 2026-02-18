import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('renders placeholder element', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
});
