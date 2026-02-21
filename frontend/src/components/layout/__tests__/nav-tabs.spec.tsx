import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { MemoryRouter } from 'react-router-dom';
import { NavTabs } from '@/components/layout/nav-tabs';

describe('NavTabs', () => {
  it('marks the current route link as active', () => {
    render(
      <MemoryRouter initialEntries={['/courses']}>
        <NavTabs />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Explore Courses/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('calls onLinkClick when a link is clicked', async () => {
    const user = userEvent.setup();
    const onLinkClick = mockFn<() => void>();

    render(
      <MemoryRouter>
        <NavTabs onLinkClick={onLinkClick} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('link', { name: /Schedule/i }));

    expect(onLinkClick).toHaveBeenCalledTimes(1);
  });

  it('renders schedule and explore as disabled when paths are blocked', () => {
    render(
      <MemoryRouter>
        <NavTabs disabledPaths={['/courses', '/schedule']} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /Explore Courses \(disabled\)/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Schedule \(disabled\)/i })).toBeDisabled();
    expect(screen.getByRole('link', { name: /Painel/i })).toBeInTheDocument();
  });
});
