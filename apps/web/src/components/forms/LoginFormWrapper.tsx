import { LoginForm, type LoginFormData as UILoginFormData } from '@cosmo-view/ui';
import { useZodForm } from '@/lib/hooks/useZodForm';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

interface LoginFormWrapperProps {
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function LoginFormWrapper({
  onSubmit,
  isLoading = false,
  className = '',
}: LoginFormWrapperProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useZodForm(loginSchema);

  const handleUISubmit = async (data: UILoginFormData) => {
    // Convert UI form data to app form data (they have the same structure)
    await onSubmit?.(data as LoginFormData);
  };

  return (
    <LoginForm
      onSubmit={handleUISubmit}
      isLoading={isLoading}
      className={className}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      isValid={isValid}
      isSubmitting={isSubmitting}
    />
  );
}
