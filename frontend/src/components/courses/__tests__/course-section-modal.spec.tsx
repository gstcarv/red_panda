import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { CourseSectionModal } from '@/components/courses/course-section-modal';
import { useMediaQuery } from '@/lib/utils';
import { useCourseById } from '@/hooks/courses/use-course-by-id';
import { useCheckCourseStatus } from '@/hooks/courses/use-check-course-status';
import type { Course, CourseSection } from '@/types/course.type';

function createSection(overrides: Partial<CourseSection> = {}): CourseSection {
  return {
    id: 10,
    teacher: { id: 100, name: 'Jane Doe' },
    meetingTimes: [{ dayOfWeek: 'Monday', startTime: '08:00', endTime: '09:00' }],
    capacity: 30,
    enrolledCount: 12,
    ...overrides,
  };
}

function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 1,
    code: 'MATH101',
    name: 'Algebra I',
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 10 },
    availableSections: [createSection()],
    ...overrides,
  };
}

const sectionListSpy = vi.fn();
const eligibilityAlertSpy = vi.fn();
const mockUseMediaQuery = vi.mocked(useMediaQuery);
const mockUseCourseById = vi.mocked(useCourseById);
const mockUseCheckCourseStatus = vi.mocked(useCheckCourseStatus);
const onOpenChangeSpy = mockFn<(open: boolean) => void>();

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

vi.mock('@/hooks/courses/use-check-course-status', () => ({
  useCheckCourseStatus: vi.fn(),
}));

vi.mock('@/components/courses/course-student-status-tag', () => ({
  CourseStudentStatusTag: () => <span>status-tag</span>,
}));

vi.mock('@/components/courses/eligibility-alert', () => ({
  EligibilityAlert: ({ course }: { course: Course }) => {
    eligibilityAlertSpy(course.id);
    return <span data-testid="eligibility-alert" />;
  },
}));

vi.mock('@/components/courses/course-section-list', () => ({
  CourseSectionList: (props: {
    sections: Array<{ id: number }>;
    enrolledSections: Array<{ id: number }>;
  }) => {
    sectionListSpy(props);
    return <div data-testid="course-section-list" />;
  },
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="desktop-dialog">{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mobile-sheet">{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

describe('CourseSectionModal', () => {
  it('hides eligibility alert and sections when course status is passed', () => {
    sectionListSpy.mockClear();
    eligibilityAlertSpy.mockClear();
    mockUseMediaQuery.mockReturnValue(true);
    mockUseCourseById.mockReturnValue({
      data: { data: createCourse({ availableSections: [createSection({ id: 3 })] }) },
      isLoading: false,
      isError: false,
    } as never);
    mockUseCheckCourseStatus.mockReturnValue({
      status: 'passed',
      enrolledSections: [],
      isLoading: false,
      isError: false,
    });

    render(<CourseSectionModal courseId={1} open onOpenChange={onOpenChangeSpy} />);

    expect(screen.getByText('You’ve already passed this course.')).toBeInTheDocument();
    expect(screen.queryByTestId('eligibility-alert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('course-section-list')).not.toBeInTheDocument();
    expect(eligibilityAlertSpy).not.toHaveBeenCalled();
    expect(sectionListSpy).not.toHaveBeenCalled();
  });

  it('renders enrolled sections and eligibility alert when course is enrolled', () => {
    sectionListSpy.mockClear();
    eligibilityAlertSpy.mockClear();
    mockUseMediaQuery.mockReturnValue(true);
    const enrolledSection = createSection({ id: 30 });
    mockUseCourseById.mockReturnValue({
      data: { data: createCourse({ availableSections: [createSection({ id: 99 })] }) },
      isLoading: false,
      isError: false,
    } as never);
    mockUseCheckCourseStatus.mockReturnValue({
      status: 'enrolled',
      enrolledSections: [enrolledSection],
      isLoading: false,
      isError: false,
    });

    render(<CourseSectionModal courseId={1} open onOpenChange={onOpenChangeSpy} />);

    expect(screen.getByTestId('eligibility-alert')).toBeInTheDocument();
    expect(screen.getByText('Enrolled Section')).toBeInTheDocument();

    expect(sectionListSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sections: [enrolledSection],
        enrolledSections: [enrolledSection],
      }),
    );
  });
});
