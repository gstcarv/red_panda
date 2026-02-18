import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CourseSectionModal } from '@/components/courses/course-section-modal';
import { useMediaQuery } from '@/lib/utils';
import { useCourseById } from '@/hooks/courses/use-course-by-id';
import type { CourseDetails, CourseSection } from '@/types/course.type';

function createSection(overrides: Partial<CourseSection> = {}): CourseSection {
  return {
    id: 10,
    teacher: {
      id: 100,
      name: 'Jane Doe',
    },
    meetingTimes: [
      {
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '09:30',
      },
    ],
    capacity: 30,
    enrolledCount: 12,
    ...overrides,
  };
}

function createCourseDetails(overrides: Partial<CourseDetails> = {}): CourseDetails {
  return {
    id: 1,
    code: 'MATH101',
    name: 'Algebra I',
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: {
      min: 9,
      max: 10,
    },
    availableSections: [createSection()],
    ...overrides,
  };
}

vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual('@/lib/utils');
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

vi.mock('@/hooks/courses/use-course-by-id', () => ({
  useCourseById: vi.fn(),
}));

vi.mock('@/components/courses/course-section-list', () => ({
  CourseSectionList: ({
    sections,
    enrollingSectionId,
  }: {
    sections: Array<{ id: number }>;
    enrollingSectionId: number | null | undefined;
  }) => (
    <div data-testid="course-section-list">
      sections:{sections.length}-enrolling:{enrollingSectionId ?? 'none'}
    </div>
  ),
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="desktop-dialog">{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mobile-sheet">{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

const mockUseMediaQuery = vi.mocked(useMediaQuery);
const mockUseCourseById = vi.mocked(useCourseById);

describe('CourseSectionModal', () => {
  it('renders desktop details with section list and metadata', () => {
    mockUseMediaQuery.mockReturnValue(true);
    mockUseCourseById.mockReturnValue({
      data: {
        data: createCourseDetails({
          credits: 1,
          prerequisite: {
            id: 99,
            code: 'MATH001',
            name: 'Math Basics',
          },
          availableSections: [createSection({ id: 3 })],
        }),
      },
      isLoading: false,
      isError: false,
    } as never);

    render(<CourseSectionModal courseId={1} open onOpenChange={vi.fn()} />);

    expect(screen.getByTestId('desktop-dialog')).toBeInTheDocument();
    expect(screen.getByText('Algebra I')).toBeInTheDocument();
    expect(screen.getByText('1 credit')).toBeInTheDocument();
    expect(screen.getByText('Prerequisite')).toBeInTheDocument();
    expect(screen.getByTestId('course-section-list')).toHaveTextContent(
      'sections:1-enrolling:none',
    );
  });

  it('renders mobile sheet variant', () => {
    mockUseMediaQuery.mockReturnValue(false);
    mockUseCourseById.mockReturnValue({
      data: {
        data: createCourseDetails(),
      },
      isLoading: false,
      isError: false,
    } as never);

    render(<CourseSectionModal courseId={2} open onOpenChange={vi.fn()} />);

    expect(screen.getByTestId('mobile-sheet')).toBeInTheDocument();
  });

  it('shows error feedback when course loading fails', () => {
    mockUseMediaQuery.mockReturnValue(true);
    mockUseCourseById.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as never);

    render(<CourseSectionModal courseId={3} open onOpenChange={vi.fn()} />);

    expect(
      screen.getByText('Failed to load course details. Please try again.'),
    ).toBeInTheDocument();
  });
});
