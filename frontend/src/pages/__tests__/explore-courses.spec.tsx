import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { ExploreCourses } from '@/pages/explore-courses';
import { useCourses } from '@/hooks/courses/use-courses';
import { useExploreCoursesFilterStore } from '@/stores/explore-courses-filter-store';

vi.mock('@/hooks/courses/use-courses', () => ({
  useCourses: vi.fn(),
}));

vi.mock('@/hooks/use-error-handler', () => ({
  useErrorHandler: () => ({
    notifyError: vi.fn(),
  }),
}));

vi.mock('@/components/courses', () => ({
  CoursesFilter: ({ onChange }: { onChange: (value: unknown) => void }) => (
    <button onClick={() => onChange({})}>Change filter</button>
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
describe('ExploreCourses', () => {
  beforeEach(() => {
    useExploreCoursesFilterStore.setState({
      filter: {
        search: '',
        fromTime: '',
        untilTime: '',
        weekdays: [],
      },
    });

    mockUseCourses.mockReturnValue({
      data: { courses: [{ id: 1 }] },
      courses: [{ id: 1 }],
      isLoading: false,
      isError: false,
      refetch: mockFn<() => Promise<unknown>>(),
    } as never);
  });

  it('renders page title and passes fetched list state', () => {
    mockUseCourses.mockReturnValue({
      data: { courses: [{ id: 1 }] },
      courses: [{ id: 1 }],
      isLoading: false,
      isError: false,
      refetch: mockFn<() => Promise<unknown>>(),
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
      data: { courses: [] },
      courses: [],
      isLoading: false,
      isError: true,
      refetch,
    } as never);

    render(<ExploreCourses />);
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
