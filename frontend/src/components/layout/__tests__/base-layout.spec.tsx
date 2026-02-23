import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BaseLayout } from '@/components/layout/base-layout';
import { QueryClientProvider } from '@/lib/react-query';
import { useStudent } from '@/hooks/students/use-student';
import { useAuthStore } from '@/stores/auth-store';

vi.mock('@/hooks/students/use-student', () => ({
  useStudent: vi.fn(),
}));

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: vi.fn(),
}));

const mockedUseStudent = vi.mocked(useStudent);
const mockedUseAuthStore = vi.mocked(useAuthStore);
const logoutMock = vi.fn();

describe('BaseLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStudent.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as never);
    mockedUseAuthStore.mockImplementation((selector) => selector({ logout: logoutMock } as never));
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

  it('renders student name, grade and active semester when profile is loaded', () => {
    mockedUseStudent.mockReturnValue({
      data: {
        student: {
          id: 1,
          firstName: 'Jane',
          lastName: 'Doe',
          gradeLevel: 11,
          email: 'jane@example.com',
          gpa: 3.8,
          credits: {
            earned: 27,
            max: 44,
          },
          options: {
            maxCoursesPerSemester: 5,
          },
          activeSemester: {
            id: 2,
            name: 'Spring',
            year: 2025,
            orderInYear: 2,
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

    expect(screen.getByText('Grade 11')).toBeInTheDocument();

    expect(screen.getByText('Spring 2025')).toBeInTheDocument();
  });

  it('renders student name skeleton while profile is loading', () => {
    mockedUseStudent.mockReturnValue({
      data: undefined,
      isLoading: true,
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

    expect(screen.getByTestId('student-name-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('User Name')).not.toBeInTheDocument();
  });

  it('logs out when logout button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider>
        <MemoryRouter>
          <BaseLayout>
            <div>Page Content</div>
          </BaseLayout>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
