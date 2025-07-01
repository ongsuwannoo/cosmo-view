import { LoginForm } from '@/components/features/login-form';

interface AuthPageProps {
  onLogin: (data: { email: string; password: string }) => void;
  isLoading?: boolean;
}

export function AuthPage({ onLogin, isLoading = false }: AuthPageProps) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-foreground'>Welcome to Cosmo View</h1>
          <p className='text-muted-foreground mt-2'>
            A modern Component-Driven Development platform
          </p>
        </div>
        <LoginForm onSubmit={onLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}
