import type { ReactNode } from 'react';

interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export function FormField({ children, className = '' }: FormFieldProps) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

interface FormLabelProps {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormLabel({ htmlFor, required, children, className = '' }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
      {required && <span className='text-red-500 ml-1'>*</span>}
    </label>
  );
}

interface FormErrorProps {
  children?: ReactNode;
  className?: string;
}

export function FormError({ children, className = '' }: FormErrorProps) {
  if (!children) return null;

  return <p className={`text-sm text-red-600 dark:text-red-400 ${className}`}>{children}</p>;
}

interface FormHelperTextProps {
  children?: ReactNode;
  className?: string;
}

export function FormHelperText({ children, className = '' }: FormHelperTextProps) {
  if (!children) return null;

  return <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>;
}
