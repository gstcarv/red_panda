import { useCallback } from 'react';
import { toast } from 'sonner';

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
};

export function useErrorHandler() {
  const getErrorMessage = useCallback(
    (error: unknown, defaultMessage = 'Something went wrong.') => {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as ApiErrorShape;
        return (
          apiError.response?.data?.message ??
          apiError.response?.data?.error ??
          defaultMessage
        );
      }

      if (error instanceof Error) {
        return error.message;
      }

      return defaultMessage;
    },
    [],
  );

  const notifyError = useCallback(
    (error: unknown, defaultMessage = 'Something went wrong.') => {
      const message = getErrorMessage(error, defaultMessage);
      toast.error(message);
      return message;
    },
    [getErrorMessage],
  );

  return {
    getErrorMessage,
    notifyError,
  };
}
