import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnrollmentActionButton } from '@/components/courses/enrollment-action-button';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { useCourseHistory } from '@/hooks/courses/use-course-history';

vi.mock('@/hooks/enrollments/use-enroll', () => ({
  useEnroll: () => ({ isPending: false, mutate: vi.fn() }),
}));

vi.mock('@/hooks/enrollments/use-unenroll', () => ({
  useUnenroll: () => ({ isPending: false, mutate: vi.fn() }),
}));

vi.mock('@/hooks/use-error-handler', () => ({
  useErrorHandler: () => ({ notifyError: vi.fn() }),
}));

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

vi.mock('@/hooks/courses/use-course-history', () => ({
  useCourseHistory: vi.fn(),
}));

const mockedUseEnrollments = vi.mocked(useEnrollments);
const mockedUseCourseHistory = vi.mocked(useCourseHistory);

describe('EnrollmentActionButton', () => {
  it('disables unenroll when course is passed', () => {
    mockedUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [
            {
              id: 'enroll-1',
              course: { id: 1 },
              courseSection: { id: 10 },
            },
          ],
        },
      },
    } as never);

    mockedUseCourseHistory.mockReturnValue({
      data: {
        data: {
          courseHistory: [
            {
              id: 1,
              courseId: 1,
              courseName: 'Course 1',
              semesterId: 1,
              status: 'passed',
            },
          ],
        },
      },
    } as never);

    render(<EnrollmentActionButton courseId={1} sectionId={10} />);

    const button = screen.getByRole('button', { name: 'Passed' });
    expect(button).toBeDisabled();
  });
});

