import { ApiError } from '@/lib/api/client';
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants/error-codes';
import { useCallback } from 'react';

export interface ErrorInfo {
  code: string;
  message: string;
  status?: number;
  data?: unknown;
}

export interface UseErrorHandlerOptions {
  onError?: (error: ErrorInfo) => void;
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onNetworkError?: () => void;
  showToast?: boolean;
}

/**
 * Enhanced error handler hook
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { onError, onUnauthorized, onForbidden, onNetworkError, showToast = true } = options;

  const handleError = useCallback(
    (error: unknown): ErrorInfo => {
      let errorInfo: ErrorInfo;

      if (error instanceof ApiError) {
        errorInfo = {
          code: error.code,
          message: error.message,
          ...(error.status !== undefined && { status: error.status }),
          data: error.data,
        };
      } else if (error instanceof Error) {
        errorInfo = {
          code: ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
        };
      } else {
        errorInfo = {
          code: ERROR_CODES.UNKNOWN_ERROR,
          message: ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
        };
      }

      // Handle specific error types
      switch (errorInfo.code) {
        case ERROR_CODES.UNAUTHORIZED:
          onUnauthorized?.();
          break;
        case ERROR_CODES.FORBIDDEN:
          onForbidden?.();
          break;
        case ERROR_CODES.NETWORK_ERROR:
        case ERROR_CODES.OFFLINE_ERROR:
          onNetworkError?.();
          break;
      }

      // Show toast notification if enabled
      if (showToast) {
        // You can integrate with your toast library here
        console.error('API Error:', errorInfo);
      }

      // Call custom error handler
      onError?.(errorInfo);

      return errorInfo;
    },
    [onError, onUnauthorized, onForbidden, onNetworkError, showToast]
  );

  return { handleError };
}

/**
 * Hook for handling mutation errors with automatic retry logic
 */
export function useMutationErrorHandler() {
  const { handleError } = useErrorHandler();

  const shouldRetry = useCallback((error: unknown, attemptCount: number): boolean => {
    if (!(error instanceof ApiError)) {
      return attemptCount < 3;
    }

    // Don't retry on client errors (4xx) except for specific cases
    if (error.status && error.status >= 400 && error.status < 500) {
      // Retry on rate limiting
      if (error.code === ERROR_CODES.RATE_LIMITED && attemptCount < 3) {
        return true;
      }
      // Don't retry on other client errors
      return false;
    }

    // Retry on server errors (5xx) and network errors
    return attemptCount < 3;
  }, []);

  const getRetryDelay = useCallback((attemptCount: number, error: unknown): number => {
    if (error instanceof ApiError && error.code === ERROR_CODES.RATE_LIMITED) {
      // For rate limiting, use exponential backoff starting from 5 seconds
      return Math.min(5000 * 2 ** attemptCount, 60000);
    }

    // For other errors, use standard exponential backoff
    return Math.min(1000 * 2 ** attemptCount, 30000);
  }, []);

  return {
    handleError,
    shouldRetry,
    getRetryDelay,
  };
}

/**
 * Hook for handling query errors with automatic refetch logic
 */
export function useQueryErrorHandler() {
  const { handleError } = useErrorHandler({
    showToast: false, // Don't show toast for query errors by default
  });

  const shouldRefetch = useCallback((error: unknown): boolean => {
    if (!(error instanceof ApiError)) {
      return true;
    }

    // Don't refetch on auth errors
    if (error.code === ERROR_CODES.UNAUTHORIZED || error.code === ERROR_CODES.FORBIDDEN) {
      return false;
    }

    // Don't refetch on not found
    if (error.code === ERROR_CODES.NOT_FOUND) {
      return false;
    }

    // Refetch on other errors
    return true;
  }, []);

  return {
    handleError,
    shouldRefetch,
  };
}
