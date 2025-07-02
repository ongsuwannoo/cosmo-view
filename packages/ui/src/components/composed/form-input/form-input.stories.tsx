import { FormInput } from '@/components/composed/form-input';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FormInput> = {
  title: 'Composed/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    helperText: {
      control: { type: 'text' },
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default Input',
    placeholder: 'Enter text...',
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'john@example.com',
    type: 'email',
    helperText: 'We will never share your email with anyone else.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    error: { message: 'Username is required' },
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
};
