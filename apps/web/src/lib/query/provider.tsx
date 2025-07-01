import { ApiError } from '@/lib/api/client';
import { ERROR_CODES } from '@/lib/constants/error-codes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

// Default query client configuration
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 5 minutes
        staleTime: 5 * 60 * 1000,
        // Cache time: 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry configuration
        retry: (failureCount, error) => {
          // Don't retry on auth errors
          if (error instanceof ApiError) {
            if (error.code === ERROR_CODES.UNAUTHORIZED || error.code === ERROR_CODES.FORBIDDEN) {
              return false;
            }
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus only in production
        refetchOnWindowFocus: import.meta.env.PROD,
        // Refetch on reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry mutations only once
        retry: 1,
        // Retry delay for mutations
        retryDelay: 1000,
      },
    },
  });
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} position='bottom' />}
    </QueryClientProvider>
  );
}
