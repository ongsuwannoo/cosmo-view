import { Button } from '@/components/base/button';
import { Input } from '@/components/base/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/composed/card';
import type { ReactNode } from 'react';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormFieldProps {
  name: string;
  error?: { message?: string };
  [key: string]: unknown;
}

export interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
  register?: (name: string) => LoginFormFieldProps;
  handleSubmit?: (
    fn: (data: LoginFormData) => void | Promise<void>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors?: {
    email?: { message?: string };
    password?: { message?: string };
  };
  isValid?: boolean;
  isSubmitting?: boolean;
  children?: ReactNode;
}

// Custom FormInput component for this form
function FormInput({
  id,
  type,
  label,
  placeholder,
  error,
  disabled,
  required,
  name,
  ...props
}: {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  error?: { message?: string } | undefined;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  [key: string]: unknown;
}) {
  return (
    <div className='space-y-2'>
      <label htmlFor={id} className='text-sm font-medium'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      <Input
        id={id}
        name={name || id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error?.message && <p className='text-sm text-red-500'>{error.message}</p>}
    </div>
  );
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  className = '',
  register,
  handleSubmit,
  errors = {},
  isValid = true,
  isSubmitting = false,
  children,
}: LoginFormProps) {
  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error('Login form submission error:', error);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  // If register and handleSubmit are provided, use external form management
  if (register && handleSubmit) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
            <FormInput
              {...register('email')}
              id='email'
              type='email'
              label='Email'
              placeholder='Enter your email'
              error={errors.email}
              disabled={isFormDisabled}
              required
            />

            <FormInput
              {...register('password')}
              id='password'
              type='password'
              label='Password'
              placeholder='Enter your password'
              error={errors.password}
              disabled={isFormDisabled}
              required
            />

            <Button type='submit' className='w-full' disabled={isFormDisabled || !isValid}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            {children}
          </form>
        </CardContent>
      </Card>
    );
  }

  // Fallback to internal state management for simple use cases
  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
              email: formData.get('email') as string,
              password: formData.get('password') as string,
            };
            handleFormSubmit(data);
          }}
          className='space-y-4'
        >
          <FormInput
            id='email'
            type='email'
            label='Email'
            placeholder='Enter your email'
            disabled={isFormDisabled}
            required
          />

          <FormInput
            id='password'
            type='password'
            label='Password'
            placeholder='Enter your password'
            disabled={isFormDisabled}
            required
          />

          <Button type='submit' className='w-full' disabled={isFormDisabled}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {children}
        </form>
      </CardContent>
    </Card>
  );
}
