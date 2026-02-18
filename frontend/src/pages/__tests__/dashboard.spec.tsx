import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dashboard } from '@/pages/dashboard';

describe('Dashboard', () => {
  it('renders dashboard heading and text', () => {
    render(<Dashboard />);

    expect(
      screen.getByRole('heading', { name: 'Dashboard', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Welcome to the dashboard.')).toBeInTheDocument();
  });
});
