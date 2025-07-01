import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldValues, type UseFormProps, useForm } from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';

/**
 * Custom hook that extends useForm with Zod validation
 * @param schema - Zod schema for validation
 * @param options - Additional react-hook-form options
 */
export function useZodForm<T extends FieldValues>(
  schema: ZodType<T, ZodTypeDef, T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
) {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur', // Validate on blur for better UX
    reValidateMode: 'onChange', // Re-validate on change after first validation
    ...options,
  });
}

/**
 * Helper function to extract error message from form field
 * @param error - Form field error object
 */
export function getFieldError(error?: { message?: string }) {
  return error?.message;
}

/**
 * Helper function to check if form field has error
 * @param error - Form field error object
 */
export function hasFieldError(error?: { message?: string }) {
  return Boolean(error?.message);
}

/**
 * Helper to get form submission handler that prevents default
 * @param onSubmit - Submit handler function
 */
export function createSubmitHandler<T>(onSubmit: (data: T) => void | Promise<void>) {
  return async (data: T) => {
    try {
      const result = onSubmit(data);
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };
}
