import type { ReactNode } from 'react';
import { Button } from '@/components/base/button';

interface DashboardShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    email: string;
  } | undefined;
  onLogout?: () => void;
  className?: string;
}

export function DashboardShell({
  children,
  title,
  subtitle,
  user,
  onLogout,
  className = '',
}: DashboardShellProps) {
  return (
    <div className={`min-h-screen bg-background p-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          {user && onLogout && (
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
