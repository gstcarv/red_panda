import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

describe('Card', () => {
  it('renders header, content and footer slots', () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Header')).toHaveAttribute('data-slot', 'card-header');
    expect(screen.getByText('Body')).toHaveAttribute('data-slot', 'card-content');
    expect(screen.getByText('Footer')).toHaveAttribute('data-slot', 'card-footer');
  });
});
