import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

describe('Alert', () => {
  it('renders semantic alert structure with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Notice</AlertTitle>
        <AlertDescription>Something happened.</AlertDescription>
      </Alert>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Notice')).toBeInTheDocument();
    expect(screen.getByText('Something happened.')).toBeInTheDocument();
  });
});
