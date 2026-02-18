import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BaseLayout } from '@/components/layout/base-layout';
import { QueryClientProvider } from '@/lib/react-query';
import { useStudent } from '@/hooks/students/use-student';

vi.mock('@/hooks/students/use-student', () => ({
  useStudent: vi.fn(),
}));

const mockedUseStudent = vi.mocked(useStudent);

describe('BaseLayout', () => {
  beforeEach(() => {
    mockedUseStudent.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as never);
  });

  it('renders branding, navigation and children content', () => {
    render(
      <QueryClientProvider>
        <MemoryRouter>
          <BaseLayout>
            <div>Page Content</div>
          </BaseLayout>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('link', { name: /Mapplewood/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('renders student name and credits when profile is loaded', () => {
    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Jane',
            lastName: 'Doe',
            gradeLevel: 11,
            email: 'jane@example.com',
            gpa: 3.8,
            creditsEarned: 27,
          },
        },
      },
      isLoading: false,
      isError: false,
    } as never);

    render(
      <QueryClientProvider>
        <MemoryRouter>
          <BaseLayout>
            <div>Page Content</div>
          </BaseLayout>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('27 credits')).toBeInTheDocument();
  });
});
