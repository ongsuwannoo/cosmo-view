# Form Validation System

This project implements a comprehensive form validation system using Zod schemas with React Hook Form, providing type-safe forms with excellent developer experience.

## 🏗️ Architecture

### Core Components

1. **Validation Schemas** (`/lib/validations/`)
   - Zod schemas for runtime validation
   - TypeScript type inference
   - Reusable validation patterns

2. **Form Components** (`/components/ui/`)
   - `FormInput` - Enhanced input with error handling
   - `FormSelect` - Dropdown with validation
   - `FormTextarea` - Multi-line text input
   - `FormCheckbox` - Checkbox with proper styling

3. **Form Hooks** (`/lib/hooks/`)
   - `useZodForm` - Custom hook combining React Hook Form + Zod
   - Helper functions for error handling

4. **Complete Forms** (`/components/forms/`)
   - `LoginForm` - Authentication form
   - `RegisterForm` - User registration
   - `ContactForm` - Contact/inquiry form

## 🎯 Key Features

### Type Safety
- Full TypeScript integration
- Automatic type inference from Zod schemas
- Compile-time validation of form data

### Validation Features
- Real-time validation on blur
- Re-validation on change after first validation
- Custom error messages
- Field-level and form-level validation
- Password strength validation
- Email format validation
- Complex validation rules (password confirmation, etc.)

### User Experience
- Loading states during submission
- Disabled states for better UX
- Accessible form labels and error messages
- Helper text support
- Error styling with visual feedback

### Developer Experience
- Minimal boilerplate
- Reusable validation schemas
- Consistent API across all forms
- Easy to extend and customize

## 📝 Usage Examples

### Basic Form with Validation

```tsx
import { useZodForm } from '@/lib/hooks/useZodForm';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { FormInput } from '@/components/ui/FormInput';

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useZodForm(loginSchema);

  const handleFormSubmit = async (data: LoginFormData) => {
    // Form data is fully typed and validated
    console.log(data); // { email: string, password: string }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormInput
        {...register('email')}
        id="email"
        type="email"
        label="Email"
        error={errors.email}
        required
      />
      
      <FormInput
        {...register('password')}
        id="password"
        type="password"
        label="Password"
        error={errors.password}
        required
      />
      
      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Creating Custom Validation Schema

```tsx
import { z } from 'zod';
import { emailSchema, nameSchema } from '@/lib/validations/common';

export const userProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  age: z.number().min(18, 'Must be at least 18 years old'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
```

### Advanced Form with Multiple Field Types

```tsx
function ContactForm() {
  const form = useZodForm(contactSchema);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        {...form.register('name')}
        label="Full Name"
        error={form.formState.errors.name}
        required
      />
      
      <FormSelect
        {...form.register('priority')}
        label="Priority"
        error={form.formState.errors.priority}
        required
      >
        <option value="">Select priority</option>
        <option value="low">Low</option>
        <option value="high">High</option>
      </FormSelect>
      
      <FormTextarea
        {...form.register('message')}
        label="Message"
        error={form.formState.errors.message}
        rows={4}
        required
      />
      
      <FormCheckbox
        {...form.register('newsletter')}
        label="Subscribe to newsletter"
        error={form.formState.errors.newsletter}
      />
    </form>
  );
}
```

## 🔧 Available Validation Schemas

### Authentication (`/lib/validations/auth.ts`)
- `loginSchema` - Email + password
- `registerSchema` - Full registration with password confirmation
- `forgotPasswordSchema` - Email for password reset
- `resetPasswordSchema` - Password reset with token
- `changePasswordSchema` - Change password with current password

### Common Patterns (`/lib/validations/common.ts`)
- `emailSchema` - Email validation
- `passwordSchema` - Strong password requirements
- `nameSchema` - Name validation (letters and spaces only)
- `phoneSchema` - International phone number format
- `urlSchema` - URL validation

### Forms (`/lib/validations/forms.ts`)
- `contactSchema` - Contact form with multiple field types
- `personalInfoSchema` - Personal information
- `addressSchema` - Address information
- `preferencesSchema` - User preferences

## 🎨 Form Components

### FormInput
Enhanced input component with built-in error handling and styling.

**Props:**
- All standard HTML input props
- `label?: string` - Field label
- `error?: FieldError` - Validation error
- `helperText?: string` - Helper text below input

### FormSelect
Dropdown/select component with validation support.

**Props:**
- All standard HTML select props
- `label?: string` - Field label
- `error?: FieldError` - Validation error
- `helperText?: string` - Helper text

### FormTextarea
Multi-line text input with validation.

**Props:**
- All standard HTML textarea props
- `label?: string` - Field label
- `error?: FieldError` - Validation error
- `helperText?: string` - Helper text

### FormCheckbox
Checkbox component with proper styling and validation.

**Props:**
- All standard HTML input props (type="checkbox")
- `label?: string` - Checkbox label
- `error?: FieldError` - Validation error
- `helperText?: string` - Helper text

## 🚀 Best Practices

### 1. Schema Organization
- Keep schemas in separate files by domain
- Export both schema and inferred types
- Reuse common validation patterns

### 2. Error Handling
- Always handle form submission errors
- Provide meaningful error messages
- Use loading states during submission

### 3. Accessibility
- Always provide labels for form fields
- Use proper ARIA attributes
- Ensure keyboard navigation works

### 4. Performance
- Use `mode: 'onBlur'` for initial validation
- Use `reValidateMode: 'onChange'` for re-validation
- Debounce expensive validations if needed

### 5. User Experience
- Disable submit button when form is invalid
- Show loading states during submission
- Provide helper text for complex fields
- Use appropriate input types (email, tel, etc.)

## 📚 Additional Resources

- [Zod Documentation](https://zod.dev/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Form Accessibility Guidelines](https://www.w3.org/WAI/tutorials/forms/)

## 🔮 Future Enhancements

- [ ] Field-level async validation
- [ ] Form wizard/multi-step forms
- [ ] File upload component
- [ ] Rich text editor component
- [ ] Date/time picker components
- [ ] Form auto-save functionality
- [ ] Internationalization (i18n) support
