import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageTitle } from '@/components/ui/page-title';

describe('PageTitle', () => {
  it('renders title, description and action', () => {
    render(
      <PageTitle
        title="Courses"
        description="Manage your semester"
        action={<button>New</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Courses' })).toBeInTheDocument();
    expect(screen.getByText('Manage your semester')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
  });
});
