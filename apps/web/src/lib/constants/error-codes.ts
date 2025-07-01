/**
 * Error codes and messages for the application
 */
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  OFFLINE_ERROR: 'OFFLINE_ERROR',

  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  MISSING_FIELDS: 'MISSING_FIELDS',

  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  BAD_GATEWAY: 'BAD_GATEWAY',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',

  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ERROR_CODES.OFFLINE_ERROR]: 'You are currently offline. Please check your connection.',

  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ERROR_CODES.FORBIDDEN]: 'Access to this resource is forbidden.',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password.',

  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.INVALID_REQUEST]: 'Invalid request format.',
  [ERROR_CODES.MISSING_FIELDS]: 'Required fields are missing.',

  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Internal server error. Please try again later.',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable.',
  [ERROR_CODES.BAD_GATEWAY]: 'Bad gateway error. Please try again.',

  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_CODES.CONFLICT]: 'A conflict occurred with the current state.',
  [ERROR_CODES.RATE_LIMITED]: 'Too many requests. Please try again later.',

  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred.',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
