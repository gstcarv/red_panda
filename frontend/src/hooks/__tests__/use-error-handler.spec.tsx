import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useErrorHandler', () => {
  it('extracts API message with fallback support', () => {
    const { result } = renderHook(() => useErrorHandler());

    const message = result.current.getErrorMessage(
      {
        response: {
          data: {
            message: 'Section is full',
          },
        },
      },
      'Failed to enroll',
    );

    expect(message).toBe('Section is full');
  });

  it('uses Error.message for regular errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    const message = result.current.getErrorMessage(
      new Error('Network offline'),
      'Fallback',
    );

    expect(message).toBe('Network offline');
  });

  it('shows toast through notifyError and returns the message', () => {
    const { result } = renderHook(() => useErrorHandler());

    const message = result.current.notifyError(
      { response: { data: { error: 'Bad request' } } },
      'Fallback',
    );

    expect(message).toBe('Bad request');
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Bad request');
  });
});
