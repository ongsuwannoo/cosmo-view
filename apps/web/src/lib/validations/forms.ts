import { z } from 'zod';
import { emailSchema, nameSchema, phoneSchema, requiredString } from './common';

// Contact form schema
export const contactSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  company: z.string().optional(),
  subject: requiredString('Subject'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority level',
  }),
  newsletter: z.boolean().optional().default(false),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Multi-step form schema
export const personalInfoSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

export const addressSchema = z.object({
  street: requiredString('Street address'),
  city: requiredString('City'),
  state: requiredString('State'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: requiredString('Country'),
});

export const preferencesSchema = z.object({
  notifications: z.boolean().default(true),
  newsletter: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type PreferencesFormData = z.infer<typeof preferencesSchema>;
