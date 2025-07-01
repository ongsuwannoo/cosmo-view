import { LoginForm } from '@/components/features/login-form';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LoginForm> = {
  title: 'Features/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data: { email: string; password: string }) => console.log('Login attempt:', data),
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data: { email: string; password: string }) => console.log('Login attempt:', data),
    isLoading: true,
  },
};
