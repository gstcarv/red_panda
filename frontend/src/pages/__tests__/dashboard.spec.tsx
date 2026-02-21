import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dashboard } from '@/pages/dashboard';
import { useStudent } from '@/hooks/students/use-student';
import { useCourseHistory } from '@/hooks/courses/use-course-history';

vi.mock('@/components/courses/course-student-status-tag', () => ({
  CourseStudentStatusTag: () => <span>Status</span>,
}));

vi.mock('@/components/courses/course-section-modal', () => ({
  CourseDetailsModal: ({
    open,
    courseId,
    semesterId,
  }: {
    open: boolean;
    courseId: number | null;
    semesterId?: number | null;
  }) =>
    open ? (
      <div data-testid="course-details-modal">
        Course details for {courseId} on semester {semesterId}
      </div>
    ) : null,
}));

vi.mock('@/hooks/students/use-student', () => ({
  useStudent: vi.fn(),
}));

vi.mock('@/hooks/courses/use-course-history', () => ({
  useCourseHistory: vi.fn(),
}));

const mockedUseStudent = vi.mocked(useStudent);
const mockedUseCourseHistory = vi.mocked(useCourseHistory);

function mockLoadedState() {
  const studentRefetch = vi.fn().mockResolvedValue({});
  const historyRefetch = vi.fn().mockResolvedValue({});

  mockedUseStudent.mockReturnValue({
    data: {
      data: {
        student: {
          id: 1,
          firstName: 'Alex',
          lastName: 'Johnson',
          gradeLevel: 11,
          email: 'alex@example.com',
          gpa: 3.7,
          credits: {
            earned: 30,
            max: 44,
          },
          options: {
            maxCoursesPerSemester: 5,
          },
        },
      },
    },
    isLoading: false,
    isError: false,
    refetch: studentRefetch,
  } as never);

  mockedUseCourseHistory.mockReturnValue({
    data: {
      data: {
        courseHistory: [
          {
            id: 1,
            courseId: 2,
            courseName: 'Introduction to Programming',
            semester: {
              id: 2,
              name: 'Spring',
              year: 2024,
              order_in_year: 2,
            },
            status: 'passed',
          },
          {
            id: 2,
            courseId: 3,
            courseName: 'Data Structures',
            semester: {
              id: 3,
              name: 'Fall',
              year: 2024,
              order_in_year: 1,
            },
            status: 'failed',
          },
        ],
      },
    },
    isLoading: false,
    isError: false,
    refetch: historyRefetch,
  } as never);

  return { studentRefetch, historyRefetch };
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard metrics, progress and history', () => {
    mockLoadedState();

    render(<Dashboard />);

    expect(
      screen.getByRole('heading', { name: 'Student Dashboard', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('3.70')).toBeInTheDocument();
    expect(screen.getAllByText('30/44').length).toBeGreaterThan(0);
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
    expect(screen.getByText('1 passed, 1 failed')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Fall 2024/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Spring 2024/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument();
    expect(screen.queryByText('Introduction to Programming')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'See more' })).not.toBeInTheDocument();
  });

  it('opens course details modal when clicking a history course', async () => {
    const user = userEvent.setup();
    mockLoadedState();

    render(<Dashboard />);

    await user.click(screen.getByRole('button', { name: /^Fall 2024/i }));
    await user.click(
      screen.getByRole('button', { name: /Data Structures/i }),
    );

    expect(screen.getByTestId('course-details-modal')).toHaveTextContent(
      'Course details for 3 on semester 3',
    );
  });

  it('renders all history records without See more', async () => {
    const user = userEvent.setup();
    const studentRefetch = vi.fn().mockResolvedValue({});
    const historyRefetch = vi.fn().mockResolvedValue({});

    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Alex',
            lastName: 'Johnson',
            gradeLevel: 11,
            email: 'alex@example.com',
            gpa: 3.7,
            credits: {
              earned: 30,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
      refetch: studentRefetch,
    } as never);

    mockedUseCourseHistory.mockReturnValue({
      data: {
        data: {
          courseHistory: [
            {
              id: 1,
              courseId: 101,
              courseName: 'Course A',
              semester: {
                id: 1,
                name: 'Fall',
                year: 2023,
                order_in_year: 1,
              },
              status: 'passed',
            },
            {
              id: 2,
              courseId: 102,
              courseName: 'Course B',
              semester: {
                id: 2,
                name: 'Spring',
                year: 2024,
                order_in_year: 2,
              },
              status: 'passed',
            },
            {
              id: 3,
              courseId: 103,
              courseName: 'Course C',
              semester: {
                id: 3,
                name: 'Fall',
                year: 2024,
                order_in_year: 1,
              },
              status: 'failed',
            },
            {
              id: 4,
              courseId: 104,
              courseName: 'Course D',
              semester: {
                id: 4,
                name: 'Spring',
                year: 2025,
                order_in_year: 2,
              },
              status: 'passed',
            },
            {
              id: 5,
              courseId: 105,
              courseName: 'Course E',
              semester: {
                id: 5,
                name: 'Fall',
                year: 2025,
                order_in_year: 1,
              },
              status: 'failed',
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
      refetch: historyRefetch,
    } as never);

    render(<Dashboard />);

    expect(screen.queryByRole('button', { name: 'See more' })).not.toBeInTheDocument();
    expect(screen.queryByText('Course A')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Fall 2023/i }));
    expect(screen.getByText('Course A')).toBeInTheDocument();
  });

  it('renders empty history message when no records exist', () => {
    const studentRefetch = vi.fn().mockResolvedValue({});
    const historyRefetch = vi.fn().mockResolvedValue({});

    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Alex',
            lastName: 'Johnson',
            gradeLevel: 11,
            email: 'alex@example.com',
            gpa: 3.7,
            credits: {
              earned: 30,
              max: 44,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
      refetch: studentRefetch,
    } as never);

    mockedUseCourseHistory.mockReturnValue({
      data: {
        data: {
          courseHistory: [],
        },
      },
      isLoading: false,
      isError: false,
      refetch: historyRefetch,
    } as never);

    render(<Dashboard />);

    expect(screen.getByText('No historical courses found yet.')).toBeInTheDocument();
  });

  it('renders loading skeletons while data is loading', () => {
    mockedUseStudent.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as never);
    mockedUseCourseHistory.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as never);

    const { container } = render(<Dashboard />);

    expect(
      screen.getByRole('heading', { name: 'Student Dashboard', level: 1 }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('shows graduation success banner when required credits are reached', () => {
    const studentRefetch = vi.fn().mockResolvedValue({});
    const historyRefetch = vi.fn().mockResolvedValue({});

    mockedUseStudent.mockReturnValue({
      data: {
        data: {
          student: {
            id: 1,
            firstName: 'Alex',
            lastName: 'Johnson',
            gradeLevel: 11,
            email: 'alex@example.com',
            gpa: 3.7,
            credits: {
              earned: 30,
              max: 30,
            },
            options: {
              maxCoursesPerSemester: 5,
            },
          },
        },
      },
      isLoading: false,
      isError: false,
      refetch: studentRefetch,
    } as never);

    mockedUseCourseHistory.mockReturnValue({
      data: {
        data: {
          courseHistory: [],
        },
      },
      isLoading: false,
      isError: false,
      refetch: historyRefetch,
    } as never);

    render(<Dashboard />);

    expect(screen.getByText('Graduation successful')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You reached 30/30 credits and completed your graduation requirement.',
      ),
    ).toBeInTheDocument();
  });

  it('renders error state and retries both queries', async () => {
    const user = userEvent.setup();
    const { studentRefetch, historyRefetch } = mockLoadedState();

    mockedUseStudent.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: studentRefetch,
    } as never);
    mockedUseCourseHistory.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: historyRefetch,
    } as never);

    render(<Dashboard />);

    expect(screen.getByText('Unable to load dashboard')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(studentRefetch).toHaveBeenCalledTimes(1);
    expect(historyRefetch).toHaveBeenCalledTimes(1);
  });
});
