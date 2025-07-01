import { z } from 'zod';

// Common validation patterns
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name must be less than 50 characters long')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number');

export const urlSchema = z.string().url('Please enter a valid URL');

// Common field schemas for reuse
export const requiredString = (fieldName: string) => z.string().min(1, `${fieldName} is required`);

export const optionalString = z.string().optional();

export const requiredNumber = (fieldName: string) =>
  z.number({ required_error: `${fieldName} is required` });

export const optionalNumber = z.number().optional();
