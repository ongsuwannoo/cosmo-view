import type { ComponentProps, ReactNode } from 'react';
import { forwardRef } from 'react';

interface FormFieldError {
  message?: string;
}

interface FormSelectProps extends ComponentProps<'select'> {
  label?: string;
  error?: FormFieldError | undefined;
  helperText?: string;
  children: ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helperText, className, children, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className='space-y-2'>
        {label && (
          <label
            htmlFor={props.id}
            className='text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            {label}
            {props.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } ${className || ''}`}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
          }
          {...props}
        >
          {children}
        </select>
        {error && (
          <p id={`${props.id}-error`} className='text-sm text-red-600 dark:text-red-400'>
            {error.message}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className='text-sm text-gray-500 dark:text-gray-400'>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
