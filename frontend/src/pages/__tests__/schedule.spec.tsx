import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Schedule } from '@/pages/schedule';

describe('Schedule', () => {
  it('renders schedule heading and description', () => {
    render(<Schedule />);

    expect(
      screen.getByRole('heading', { name: 'Schedule', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your schedule for the current semester.'),
    ).toBeInTheDocument();
  });
});
