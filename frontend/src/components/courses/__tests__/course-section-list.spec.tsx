import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { CourseSectionList } from '@/components/courses/course-section-list';
import type { Course, CourseSection } from '@/types/course.type';

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

const enrollmentActionButtonSpy = vi.fn();
const useCheckEnrollmentEligibilitySpy = mockFn<
  () => {
    evaluate: () => {
      eligible: boolean;
      validation?: Array<{
        message: string;
        type: 'conflict' | 'grade_level' | 'max_courses' | 'prerequisite' | 'other';
      }>;
    };
  }
>();

vi.mock('@formkit/auto-animate/react', () => ({
  useAutoAnimate: () => [vi.fn()],
}));

vi.mock('@/hooks/enrollments/use-check-enrollment-eligibility', () => ({
  useCheckEnrollmentEligibility: () => useCheckEnrollmentEligibilitySpy(),
}));

vi.mock('@/components/courses/enrollment-action-button', () => ({
  EnrollmentActionButton: (props: {
    courseId: number | null;
    sectionId: number;
    isFull?: boolean;
  }) => {
    enrollmentActionButtonSpy(props);
    return (
      <button type="button">
        action-{props.sectionId}-{props.isFull ? 'full' : 'open'}
      </button>
    );
  },
}));

function createCourse(overrides: Partial<Course> = {}): Course {
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

describe('CourseSectionList', () => {
  it('renders section schedule and enrollment status', () => {
    useCheckEnrollmentEligibilitySpy.mockReturnValue({
      evaluate: () => ({
        eligible: true,
        validation: [],
      }),
    });

    render(<CourseSectionList courseId={1} course={createCourse()} sections={[createSection()]} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Mon 8:00 AM-9:30 AM')).toBeInTheDocument();
  });

  it('shows an empty state when no sections are available', () => {
    useCheckEnrollmentEligibilitySpy.mockReturnValue({
      evaluate: () => ({
        eligible: true,
        validation: [],
      }),
    });

    render(<CourseSectionList courseId={1} course={createCourse()} sections={[]} />);

    expect(screen.getByText('No sections available for this course.')).toBeInTheDocument();
  });

  it('passes course/section identifiers to EnrollmentActionButton', () => {
    enrollmentActionButtonSpy.mockClear();
    useCheckEnrollmentEligibilitySpy.mockReturnValue({
      evaluate: () => ({
        eligible: true,
        validation: [],
      }),
    });

    render(
      <CourseSectionList
        courseId={7}
        course={createCourse()}
        sections={[createSection({ id: 9 })]}
      />,
    );

    expect(enrollmentActionButtonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        courseId: 7,
        sectionId: 9,
      }),
    );
  });

  it('marks full sections in action props', () => {
    enrollmentActionButtonSpy.mockClear();
    useCheckEnrollmentEligibilitySpy.mockReturnValue({
      evaluate: () => ({
        eligible: true,
        validation: [],
      }),
    });

    render(
      <CourseSectionList
        courseId={1}
        course={createCourse()}
        sections={[createSection({ capacity: 20, enrolledCount: 20 })]}
      />,
    );

    expect(screen.getByRole('button', { name: 'action-10-full' })).toBeInTheDocument();
    expect(enrollmentActionButtonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionId: 10,
        isFull: true,
      }),
    );
  });
});
