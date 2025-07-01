import { Input } from '@cosmo-view/ui';
import { type ComponentProps, forwardRef } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormInputProps extends ComponentProps<typeof Input> {
  label?: string;
  error?: FieldError | undefined;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
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
        <Input
          ref={ref}
          className={`${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
          }
          {...props}
        />
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

FormInput.displayName = 'FormInput';
