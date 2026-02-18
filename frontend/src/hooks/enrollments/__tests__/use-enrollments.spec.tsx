import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as enrollmentsApi from '@/api/enrollments-api';
import {
  buildEnrollmentsQueryKey,
  useEnrollments,
} from '@/hooks/enrollments/use-enrollments';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useEnrollments', () => {
  it('builds a stable enrollments query key', () => {
    expect(buildEnrollmentsQueryKey()).toEqual(['enrollments']);
  });

  it('loads enrollments data from api', async () => {
    const response = {
      data: {
        enrollments: [
          {
            id: 'enroll-1',
            courseSection: {
              id: 10,
            },
          },
        ],
      },
    };
    const getEnrollmentsSpy = vi
      .spyOn(enrollmentsApi, 'getEnrollments')
      .mockResolvedValue(response as never);

    const { result } = renderHook(() => useEnrollments(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getEnrollmentsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.data?.data.enrollments).toHaveLength(1);
    expect(result.current.data?.data.enrollments[0].courseSection.id).toBe(10);
  });
});
