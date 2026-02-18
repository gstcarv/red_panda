import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
  it('renders with provided orientation', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);

    expect(screen.getByTestId('separator')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
  });
});
