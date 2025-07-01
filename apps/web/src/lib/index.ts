// API Client
export { apiClient, ApiError, API_CONFIG } from './api/client';

// Query Provider and Configuration
export { QueryProvider } from './query/provider';
export { queryKeys, invalidationMap } from './query/keys';

// API Hooks
export * from './api/hooks';

// Error Handling
export {
  useErrorHandler,
  useMutationErrorHandler,
  useQueryErrorHandler,
} from './hooks/useErrorHandler';

// Local Storage Hook
export {
  useLocalStorage,
  localStorage,
  useAuthToken,
  useUserPreferences,
} from './hooks/useLocalStorage';

// Form Utilities
export { useZodForm, getFieldError, hasFieldError, createSubmitHandler } from './hooks/useZodForm';

// Validation Schemas
export * from './validations';

// Constants
export { ERROR_CODES, ERROR_MESSAGES, type ErrorCode } from './constants/error-codes';
