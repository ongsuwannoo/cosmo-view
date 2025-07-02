import { StatCard } from '@/components/features/stat-card';
import type { Meta, StoryObj } from '@storybook/react';

// Mock icons for the stories
const DollarSignIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='h-4 w-4'
    aria-label='Dollar sign icon'
  >
    <title>Dollar sign icon</title>
    <line x1='12' y1='1' x2='12' y2='23' />
    <path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='h-4 w-4'
    aria-label='Users icon'
  >
    <title>Users icon</title>
    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
    <circle cx='9' cy='7' r='4' />
    <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
    <path d='M16 3.13a4 4 0 0 1 0 7.75' />
  </svg>
);

const meta: Meta<typeof StatCard> = {
  title: 'Features/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    value: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Total Revenue',
    value: '$45,231.89',
    description: '+20.1% from last month',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Total Revenue',
    value: '$45,231.89',
    description: '+20.1% from last month',
    icon: <DollarSignIcon />,
  },
};

export const WithPositiveTrend: Story = {
  args: {
    title: 'Active Users',
    value: '2,350',
    description: 'User engagement',
    icon: <UsersIcon />,
    trend: {
      value: 12.5,
      label: 'from last month',
      isPositive: true,
    },
  },
};

export const WithNegativeTrend: Story = {
  args: {
    title: 'Bounce Rate',
    value: '2.4%',
    description: 'Page bounce rate',
    trend: {
      value: 5.2,
      label: 'from last month',
      isPositive: false,
    },
  },
};

export const Large: Story = {
  args: {
    title: 'Sales',
    value: '+12,234',
    description: '+19% from last month',
    icon: <DollarSignIcon />,
    className: 'w-80',
  },
};
