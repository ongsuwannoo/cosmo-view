import type { ComponentProps } from 'react';
import { forwardRef } from 'react';

interface FormFieldError {
  message?: string;
}

interface FormCheckboxProps extends ComponentProps<'input'> {
  label?: string;
  error?: FormFieldError | undefined;
  helperText?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <input
            ref={ref}
            type='checkbox'
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
              hasError ? 'border-red-500' : ''
            } ${className || ''}`}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
            }
            {...props}
          />
          {label && (
            <label
              htmlFor={props.id}
              className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              {label}
              {props.required && <span className='text-red-500 ml-1'>*</span>}
            </label>
          )}
        </div>
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

FormCheckbox.displayName = 'FormCheckbox';
