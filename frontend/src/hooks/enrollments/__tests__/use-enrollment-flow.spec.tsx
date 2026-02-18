import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { useEnrollmentFlow } from '@/hooks/enrollments/use-enrollment-flow';
import { useEnroll } from '@/hooks/enrollments/use-enroll';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';

vi.mock('@/hooks/enrollments/use-enroll', () => ({
  useEnroll: vi.fn(),
}));

vi.mock('@/hooks/enrollments/use-enrollments', () => ({
  useEnrollments: vi.fn(),
}));

const mockUseEnroll = vi.mocked(useEnroll);
const mockUseEnrollments = vi.mocked(useEnrollments);

describe('useEnrollmentFlow', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state while enrollments are not available', () => {
    mockUseEnrollments.mockReturnValue({
      data: undefined,
    } as never);
    mockUseEnroll.mockReturnValue({
      mutate: mockFn<(sectionId: number) => void>(),
    } as never);

    const { result } = renderHook(() => useEnrollmentFlow(10));

    expect(result.current.isEnrollmentsLoading).toBe(true);
    expect(result.current.isSectionEnrolled(1)).toBe(false);
  });

  it('does not mutate when section is already enrolled', () => {
    const mutate = mockFn<(sectionId: number) => void>();

    mockUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [
            {
              courseSection: {
                id: 200,
              },
            },
          ],
        },
      },
    } as never);
    mockUseEnroll.mockReturnValue({
      mutate,
    } as never);

    const { result } = renderHook(() => useEnrollmentFlow(10));
    result.current.enrollInSection(200);

    expect(result.current.isSectionEnrolled(200)).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('mutates when section is not enrolled yet', () => {
    const mutate = mockFn<(sectionId: number) => void>();

    mockUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [],
        },
      },
    } as never);
    mockUseEnroll.mockReturnValue({
      mutate,
    } as never);

    const { result } = renderHook(() => useEnrollmentFlow(10));
    result.current.enrollInSection(300);

    expect(result.current.isSectionEnrolled(300)).toBe(false);
    expect(mutate).toHaveBeenCalledWith(300);
  });

  it('forwards success and error callbacks to mutation lifecycle', () => {
    const onSuccess = mockFn<() => void>();
    const onError = mockFn<(error: unknown) => void>();
    const expectedError = new Error('Enrollment failed');

    mockUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [],
        },
      },
    } as never);
    mockUseEnroll.mockImplementation((_courseId, options) => {
      options?.onSuccess?.({} as never, 10, undefined, undefined);
      options?.onError?.(expectedError, 10, undefined, undefined);

      return {
        mutate: mockFn<(sectionId: number) => void>(),
      } as never;
    });

    renderHook(() =>
      useEnrollmentFlow(10, {
        onSuccess,
        onError,
      }),
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expectedError);
  });

  it('tracks enrolling section id during mutation lifecycle', () => {
    let lifecycleOptions: Parameters<typeof useEnroll>[1] | undefined;

    mockUseEnrollments.mockReturnValue({
      data: {
        data: {
          enrollments: [],
        },
      },
    } as never);
    mockUseEnroll.mockImplementation((_courseId, options) => {
      lifecycleOptions = options;
      return {
        mutate: mockFn<(sectionId: number) => void>(),
      } as never;
    });

    const { result } = renderHook(() => useEnrollmentFlow(10));

    act(() => {
      lifecycleOptions?.onMutate?.(500);
    });

    expect(result.current.enrollingSectionId).toBe(500);

    act(() => {
      lifecycleOptions?.onSettled?.(undefined, undefined, 500, undefined);
    });

    expect(result.current.enrollingSectionId).toBe(null);
  });
});
