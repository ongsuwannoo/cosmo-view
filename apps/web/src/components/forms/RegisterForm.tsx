import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormInput,
} from '@cosmo-view/ui';
import { useZodForm } from '@/lib/hooks/useZodForm';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function RegisterForm({ onSubmit, isLoading = false, className = '' }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useZodForm(registerSchema);

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error('Register form submission error:', error);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your information to create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <FormInput
              {...register('firstName')}
              id='firstName'
              type='text'
              label='First Name'
              placeholder='Enter your first name'
              error={errors.firstName}
              disabled={isFormDisabled}
              required
            />

            <FormInput
              {...register('lastName')}
              id='lastName'
              type='text'
              label='Last Name'
              placeholder='Enter your last name'
              error={errors.lastName}
              disabled={isFormDisabled}
              required
            />
          </div>

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
            placeholder='Create a password'
            error={errors.password}
            disabled={isFormDisabled}
            helperText='Password must be at least 8 characters with uppercase, lowercase, number and special character'
            required
          />

          <FormInput
            {...register('confirmPassword')}
            id='confirmPassword'
            type='password'
            label='Confirm Password'
            placeholder='Confirm your password'
            error={errors.confirmPassword}
            disabled={isFormDisabled}
            required
          />

          <Button type='submit' className='w-full' disabled={isFormDisabled || !isValid}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
