import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { mockFn } from 'vitest-mock-extended';
import { PrerequisiteLink } from '@/components/courses/prerequisite-link';
import { useCourseDetailsModal } from '@/hooks/courses/use-course-details-modal';
import { useCheckCourseStatus } from '@/hooks/courses/use-check-course-status';
import type { CoursePrerequisite } from '@/types/course.type';

const courseSectionModalSpy = mockFn<
  (props: { courseId?: number; open: boolean; onOpenChange: (open: boolean) => void }) => void
>();

vi.mock('@/hooks/courses/use-course-details-modal', () => ({
  useCourseDetailsModal: vi.fn(),
}));

vi.mock('@/hooks/courses/use-check-course-status', () => ({
  useCheckCourseStatus: vi.fn(),
}));

vi.mock('@/components/courses/course-section-modal', () => ({
  CourseSectionModal: (props: {
    courseId?: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => {
    courseSectionModalSpy(props);
    return <div data-testid="course-section-modal" />;
  },
}));

const mockedUseCourseDetailsModal = vi.mocked(useCourseDetailsModal);
const mockedUseCheckCourseStatus = vi.mocked(useCheckCourseStatus);

const prerequisite: CoursePrerequisite = {
  id: 7,
  code: 'MATH101',
  name: 'Algebra I',
};

describe('PrerequisiteLink', () => {
  it('opens modal for prerequisite course when button is clicked', async () => {
    const user = userEvent.setup();
    const onCourseSelect = mockFn<(courseId: number) => void>();
    const handleCourseSelect = mockFn<(courseId: number) => void>();
    const handleModalClose = mockFn<(open: boolean) => void>();
    courseSectionModalSpy.mockReset();

    mockedUseCourseDetailsModal.mockReturnValue({
      selectedCourseId: 99,
      modalOpen: true,
      handleCourseSelect,
      handleModalClose,
    });
    mockedUseCheckCourseStatus.mockReturnValue({
      status: undefined,
      enrolledSections: [],
      isLoading: false,
      isError: false,
    });

    render(
      <PrerequisiteLink prerequisite={prerequisite} onCourseSelect={onCourseSelect} />,
    );

    expect(screen.queryByTestId('course-section-modal')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'MATH101 - Algebra I' }));

    expect(handleCourseSelect).toHaveBeenCalledWith(7);
    expect(mockedUseCourseDetailsModal).toHaveBeenCalledWith({ onCourseSelect });

    expect(await screen.findByTestId('course-section-modal')).toBeInTheDocument();
    expect(courseSectionModalSpy).toHaveBeenCalledWith({
      courseId: 99,
      open: true,
      onOpenChange: handleModalClose,
    });
  });

  it('renders status indicator when prerequisite course has a student status', () => {
    mockedUseCourseDetailsModal.mockReturnValue({
      selectedCourseId: undefined,
      modalOpen: false,
      handleCourseSelect: mockFn<(courseId: number) => void>(),
      handleModalClose: mockFn<(open: boolean) => void>(),
    });
    mockedUseCheckCourseStatus.mockReturnValue({
      status: 'passed',
      enrolledSections: [],
      isLoading: false,
      isError: false,
    });

    render(<PrerequisiteLink prerequisite={prerequisite} />);

    const button = screen.getByRole('button', { name: 'MATH101 - Algebra I' });
    expect(button).toBeInTheDocument();

    expect(button.querySelector('svg')).not.toBeNull();
  });
});
