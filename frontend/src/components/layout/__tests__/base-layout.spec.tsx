import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BaseLayout } from '@/components/layout/base-layout';

describe('BaseLayout', () => {
  it('renders branding, navigation and children content', () => {
    render(
      <MemoryRouter>
        <BaseLayout>
          <div>Page Content</div>
        </BaseLayout>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Mapplewood/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });
});
