import { ERROR_CODES, ERROR_MESSAGES, type ErrorCode } from '@/lib/constants/error-codes';
import { localStorage } from '@/lib/hooks/useLocalStorage';

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:3001/api',
  TIMEOUT: 30000, // 30 seconds
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly status?: number;
  public readonly data?: unknown;

  constructor(code: ErrorCode, message?: string, status?: number, data?: unknown) {
    super(message || ERROR_MESSAGES[code]);
    this.name = 'ApiError';
    this.code = code;
    if (status !== undefined) {
      this.status = status;
    }
    this.data = data;
  }
}

/**
 * HTTP Status Code to Error Code mapping
 */
const STATUS_TO_ERROR_CODE: Record<number, ErrorCode> = {
  400: ERROR_CODES.VALIDATION_ERROR,
  401: ERROR_CODES.UNAUTHORIZED,
  403: ERROR_CODES.FORBIDDEN,
  404: ERROR_CODES.NOT_FOUND,
  409: ERROR_CODES.CONFLICT,
  429: ERROR_CODES.RATE_LIMITED,
  500: ERROR_CODES.INTERNAL_SERVER_ERROR,
  502: ERROR_CODES.BAD_GATEWAY,
  503: ERROR_CODES.SERVICE_UNAVAILABLE,
};

/**
 * Enhanced fetch wrapper with error handling
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  // Get auth token if available
  const token = localStorage.getItem<string>('auth_token');

  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
  config.signal = controller.signal;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Handle different response types
    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      const errorCode = STATUS_TO_ERROR_CODE[response.status] || ERROR_CODES.UNKNOWN_ERROR;
      throw new ApiError(errorCode, undefined, response.status, errorData);
    }

    // Handle different content types
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return (await response.text()) as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(ERROR_CODES.TIMEOUT_ERROR);
    }

    if (!navigator.onLine) {
      throw new ApiError(ERROR_CODES.OFFLINE_ERROR);
    }

    throw new ApiError(ERROR_CODES.NETWORK_ERROR);
  }
}

/**
 * HTTP Methods
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) => {
    const config: RequestInit = {
      ...options,
      method: 'POST',
    };
    if (data !== undefined) {
      config.body = JSON.stringify(data);
    }
    return apiFetch<T>(endpoint, config);
  },

  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) => {
    const config: RequestInit = {
      ...options,
      method: 'PATCH',
    };
    if (data !== undefined) {
      config.body = JSON.stringify(data);
    }
    return apiFetch<T>(endpoint, config);
  },

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) => {
    const config: RequestInit = {
      ...options,
      method: 'PUT',
    };
    if (data !== undefined) {
      config.body = JSON.stringify(data);
    }
    return apiFetch<T>(endpoint, config);
  },

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
