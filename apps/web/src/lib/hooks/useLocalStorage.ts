import { useCallback, useEffect, useState } from 'react';

/**
 * Safely parse JSON from localStorage
 */
function parseJson<T>(value: string | null, fallback: T): T {
  try {
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Safely stringify value for localStorage
 */
function stringifyValue<T>(value: T): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/**
 * Custom hook for localStorage with type safety and reactivity
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return parseJson(item, initialValue);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (valueToStore === undefined || valueToStore === null) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, stringifyValue(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(parseJson(e.newValue, initialValue));
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Utility functions for direct localStorage access (non-reactive)
 */
export const localStorage = {
  /**
   * Get item from localStorage with type safety
   */
  getItem: <T>(key: string, fallback?: T): T | string | null => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback ?? null;

      // If fallback is provided and is not a string, try to parse JSON
      if (fallback !== undefined && typeof fallback !== 'string') {
        return parseJson(item, fallback);
      }

      return item;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return fallback ?? null;
    }
  },

  /**
   * Set item in localStorage with automatic JSON serialization
   */
  setItem: <T>(key: string, value: T): void => {
    try {
      if (value === undefined || value === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, stringifyValue(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Get all localStorage keys
   */
  keys: (): string[] => {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.warn('Error getting localStorage keys:', error);
      return [];
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable: (): boolean => {
    try {
      const test = '__localStorage_test__';
      window.localStorage.setItem(test, 'test');
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Hook for managing authentication token in localStorage
 */
export function useAuthToken() {
  const [token, setToken, removeToken] = useLocalStorage<string | null>('auth_token', null);

  const setAuthToken = useCallback(
    (newToken: string) => {
      setToken(newToken);
    },
    [setToken]
  );

  const clearAuthToken = useCallback(() => {
    removeToken();
  }, [removeToken]);

  const hasToken = Boolean(token);

  return {
    token,
    setAuthToken,
    clearAuthToken,
    hasToken,
  };
}

/**
 * Hook for managing user preferences
 */
export function useUserPreferences<T extends Record<string, unknown>>(defaultPreferences: T) {
  const [preferences, setPreferences] = useLocalStorage<T>('user_preferences', defaultPreferences);

  const updatePreference = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [setPreferences]
  );

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, [setPreferences, defaultPreferences]);

  return {
    preferences,
    setPreferences,
    updatePreference,
    resetPreferences,
  };
}
