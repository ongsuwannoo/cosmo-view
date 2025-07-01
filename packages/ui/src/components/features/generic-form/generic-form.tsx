import { Button } from '@/components/base/button';
import { Input } from '@/components/base/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/composed/card';
import type { FormEvent, ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string | undefined;
  required?: boolean | undefined;
}

function FormField({ label, children, error, required }: FormFieldProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      {children}
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

interface GenericFormProps {
  title: string;
  description?: string;
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    error?: string;
  }>;
  onSubmit: (e: FormEvent) => void;
  submitLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export function GenericForm({
  title,
  description,
  fields,
  onSubmit,
  submitLabel = 'Submit',
  isLoading = false,
  className = '',
}: GenericFormProps) {
  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='space-y-4'>
          {fields.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              required={field.required}
              error={field.error}
            >
              <Input
                type={field.type || 'text'}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            </FormField>
          ))}
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Loading...' : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
