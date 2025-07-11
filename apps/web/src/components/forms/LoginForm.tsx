import { LoginForm as UILoginForm, type LoginFormData as UILoginFormData } from '@cosmo-view/ui';
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

  const handleUISubmit = async (data: UILoginFormData) => {
    // Convert UI form data to app form data (they should be the same structure)
    await onSubmit?.(data as LoginFormData);
  };

  return (
    <UILoginForm
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
