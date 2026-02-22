import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GraduationAccessGuard } from '@/components/layout/graduation-access-guard';
import { useStudent } from '@/hooks/students/use-student';

vi.mock('@/hooks/students/use-student', () => ({
  useStudent: vi.fn(),
}));

const mockedUseStudent = vi.mocked(useStudent);

describe('GraduationAccessGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to dashboard when student reached required credits', () => {
    mockedUseStudent.mockReturnValue({
      data: {
        student: {
          credits: {
            earned: 30,
            max: 30,
          },
        },
      },
      isLoading: false,
    } as never);

    render(
      <MemoryRouter initialEntries={['/courses']}>
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route
            path="/courses"
            element={
              <GraduationAccessGuard>
                <div>Courses Page</div>
              </GraduationAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Courses Page')).not.toBeInTheDocument();
  });

  it('allows access when student has not reached required credits', () => {
    mockedUseStudent.mockReturnValue({
      data: {
        student: {
          credits: {
            earned: 22,
            max: 30,
          },
        },
      },
      isLoading: false,
    } as never);

    render(
      <MemoryRouter initialEntries={['/courses']}>
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route
            path="/courses"
            element={
              <GraduationAccessGuard>
                <div>Courses Page</div>
              </GraduationAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Courses Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
