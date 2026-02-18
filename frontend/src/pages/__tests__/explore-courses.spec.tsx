import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { ExploreCourses } from '@/pages/explore-courses';
import { useCourses } from '@/hooks/courses/use-courses';
import { useCourseById } from '@/hooks/courses/use-course-by-id';
import { useEnrollmentFlow } from '@/hooks/enrollments/use-enrollment-flow';

vi.mock('@/hooks/courses/use-courses', () => ({
  useCourses: vi.fn(),
}));

vi.mock('@/hooks/enrollments/use-enrollment-flow', () => ({
  useEnrollmentFlow: vi.fn(),
}));

vi.mock('@/hooks/courses/use-course-by-id', () => ({
  useCourseById: vi.fn(),
}));

vi.mock('@/components/courses', () => ({
  CoursesFilter: ({ onChange }: { onChange: (value: { search: string; onlyEligible: boolean }) => void }) => (
    <button onClick={() => onChange({ search: 'math', onlyEligible: true })}>
      Change filter
    </button>
  ),
  CoursesList: ({
    courses,
    isLoading,
    isError,
    onRetry,
  }: {
    courses: Array<{ id: number }>;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
  }) => (
    <div>
      <p>courses:{courses.length}</p>
      <p>loading:{String(isLoading)}</p>
      <p>error:{String(isError)}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

const mockUseCourses = vi.mocked(useCourses);
const mockUseCourseById = vi.mocked(useCourseById);
const mockUseEnrollmentFlow = vi.mocked(useEnrollmentFlow);

describe('ExploreCourses', () => {
  it('renders page title and passes fetched list state', () => {
    mockUseCourses.mockReturnValue({
      data: { data: { courses: [{ id: 1 }] } },
      isLoading: false,
      isError: false,
      refetch: mockFn<() => Promise<unknown>>(),
    } as never);
    mockUseCourseById.mockReturnValue({
      data: undefined,
    } as never);
    mockUseEnrollmentFlow.mockReturnValue({
      enrollInSection: mockFn<(sectionId: number) => void>(),
      enrollingSectionId: null,
      isSectionEnrolled: mockFn<(sectionId: number) => boolean>(),
      isEnrollmentsLoading: false,
    } as never);

    render(<ExploreCourses />);

    expect(screen.getByRole('heading', { name: 'Explore Courses' })).toBeInTheDocument();
    expect(screen.getByText('courses:1')).toBeInTheDocument();
    expect(screen.getByText('loading:false')).toBeInTheDocument();
    expect(screen.getByText('error:false')).toBeInTheDocument();
  });

  it('calls refetch when retry is requested', async () => {
    const user = userEvent.setup();
    const refetch = mockFn<() => Promise<unknown>>();
    refetch.mockResolvedValue({} as never);

    mockUseCourses.mockReturnValue({
      data: { data: { courses: [] } },
      isLoading: false,
      isError: true,
      refetch,
    } as never);
    mockUseCourseById.mockReturnValue({
      data: undefined,
    } as never);
    mockUseEnrollmentFlow.mockReturnValue({
      enrollInSection: mockFn<(sectionId: number) => void>(),
      enrollingSectionId: null,
      isSectionEnrolled: mockFn<(sectionId: number) => boolean>(),
      isEnrollmentsLoading: false,
    } as never);

    render(<ExploreCourses />);
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
