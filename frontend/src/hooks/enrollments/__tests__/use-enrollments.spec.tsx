import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as studentsApi from '@/api/students-api';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';

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
  it('loads enrollments data from api', async () => {
    const response = {
      enrollments: [
        {
          id: 'enroll-1',
          courseSection: {
            id: 10,
          },
        },
      ],
    };
    const getStudentEnrollmentsSpy = vi
      .spyOn(studentsApi, 'getStudentEnrollments')
      .mockResolvedValue(response as never);

    const { result } = renderHook(() => useEnrollments(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getStudentEnrollmentsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.data?.enrollments).toHaveLength(1);
    expect(result.current.data?.enrollments[0].courseSection.id).toBe(10);
  });
});
