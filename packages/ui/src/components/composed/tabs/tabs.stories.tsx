import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/composed/tabs';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tabs> = {
  title: 'Composed/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue='account' className='w-[400px]'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='account'>Account</TabsTrigger>
        <TabsTrigger value='password'>Password</TabsTrigger>
      </TabsList>
      <TabsContent value='account' className='space-y-2'>
        <h3 className='text-lg font-semibold'>Account Settings</h3>
        <p className='text-sm text-muted-foreground'>
          Make changes to your account here. Click save when you're done.
        </p>
      </TabsContent>
      <TabsContent value='password' className='space-y-2'>
        <h3 className='text-lg font-semibold'>Password Settings</h3>
        <p className='text-sm text-muted-foreground'>
          Change your password here. After saving, you'll be logged out.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const ThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue='general' className='w-[500px]'>
      <TabsList className='grid w-full grid-cols-3'>
        <TabsTrigger value='general'>General</TabsTrigger>
        <TabsTrigger value='advanced'>Advanced</TabsTrigger>
        <TabsTrigger value='danger'>Danger Zone</TabsTrigger>
      </TabsList>
      <TabsContent value='general' className='space-y-2'>
        <h3 className='text-lg font-semibold'>General Settings</h3>
        <p className='text-sm text-muted-foreground'>
          Configure your general preferences and settings.
        </p>
      </TabsContent>
      <TabsContent value='advanced' className='space-y-2'>
        <h3 className='text-lg font-semibold'>Advanced Settings</h3>
        <p className='text-sm text-muted-foreground'>
          Advanced configuration options for power users.
        </p>
      </TabsContent>
      <TabsContent value='danger' className='space-y-2'>
        <h3 className='text-lg font-semibold text-red-600'>Danger Zone</h3>
        <p className='text-sm text-muted-foreground'>Irreversible and destructive actions.</p>
      </TabsContent>
    </Tabs>
  ),
};
