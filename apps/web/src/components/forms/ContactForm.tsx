import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cosmo-view/ui';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { FormTextarea } from '../ui/FormTextarea';
import { FormCheckbox } from '../ui/FormCheckbox';
import { useZodForm } from '@/lib/hooks/useZodForm';
import { contactSchema, type ContactFormData } from '@/lib/validations/forms';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function ContactForm({ onSubmit, isLoading = false, className = '' }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useZodForm(contactSchema);

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error('Contact form submission error:', error);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Send us a message and we'll get back to you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
              {...register('phone')}
              id='phone'
              type='tel'
              label='Phone Number'
              placeholder='+1 (555) 123-4567'
              error={errors.phone}
              disabled={isFormDisabled}
              helperText='Optional - Include country code'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormInput
              {...register('company')}
              id='company'
              type='text'
              label='Company'
              placeholder='Enter your company name'
              error={errors.company}
              disabled={isFormDisabled}
              helperText='Optional'
            />

            <FormSelect
              {...register('priority')}
              id='priority'
              label='Priority'
              error={errors.priority}
              disabled={isFormDisabled}
              required
            >
              <option value=''>Select priority level</option>
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </FormSelect>
          </div>

          <FormInput
            {...register('subject')}
            id='subject'
            type='text'
            label='Subject'
            placeholder='What is this regarding?'
            error={errors.subject}
            disabled={isFormDisabled}
            required
          />

          <FormTextarea
            {...register('message')}
            id='message'
            label='Message'
            placeholder='Please describe your inquiry in detail...'
            error={errors.message}
            disabled={isFormDisabled}
            rows={4}
            required
          />

          <FormCheckbox
            {...register('newsletter')}
            id='newsletter'
            label='Subscribe to our newsletter for updates'
            error={errors.newsletter}
            disabled={isFormDisabled}
          />

          <Button type='submit' className='w-full' disabled={isFormDisabled || !isValid}>
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
