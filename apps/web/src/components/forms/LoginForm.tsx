import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cosmo-view/ui';
import { FormInput } from '../ui/FormInput';
import { useZodForm } from '@/lib/hooks/useZodForm';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function LoginForm({ onSubmit, isLoading = false, className = '' }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useZodForm(loginSchema);

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error('Login form submission error:', error);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

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
        </form>
      </CardContent>
    </Card>
  );
}
