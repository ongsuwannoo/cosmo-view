import { useAuthStore } from '@/stores/auth';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardShell,
  StatCard,
  Grid,
} from '@cosmo-view/ui';
import { ProjectExample } from '@/components/ProjectExample';
import { Link } from '@tanstack/react-router';

export function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <DashboardShell
      title={`Welcome, ${user?.name}!`}
      subtitle={`You're logged in as ${user?.email}`}
      user={user || undefined}
      onLogout={logout}
    >
      {/* Project Management Demo */}
      <div className='mb-8'>
        <ProjectExample />
      </div>

      {/* Dashboard Stats */}
      <Grid cols={{ default: 1, md: 2, lg: 3 }} className='mb-8'>
        <StatCard
          title='Total Projects'
          value='12'
          description='Active projects'
          trend={{ value: 20, label: 'from last month', isPositive: true }}
        />
        <StatCard
          title='Completed Tasks'
          value='89'
          description='This month'
          trend={{ value: 12, label: 'from last month', isPositive: true }}
        />
        <StatCard title='Team Members' value='8' description='Active members' />
      </Grid>

      <Grid cols={{ default: 1, md: 2, lg: 3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Form Validation Demo</CardTitle>
            <CardDescription>Zod + React Hook Form implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground mb-4'>
              Complete form validation with TypeScript, Zod schemas, and React Hook Form.
            </p>
            <Link to='/forms'>
              <Button size='sm' className='w-full'>
                View Forms Demo
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Table Demo</CardTitle>
            <CardDescription>
              Advanced table with sorting, filtering & column controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground mb-4'>
              TanStack Table integration with smart features like sorting, filtering, column
              visibility, and pagination.
            </p>
            <Link to='/table'>
              <Button size='sm' className='w-full'>
                View Data Table
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Library</CardTitle>
            <CardDescription>Browse our Component-Driven Development architecture</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Components are organized by abstraction levels: base, composed, features, and pages.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storybook</CardTitle>
            <CardDescription>Interactive component documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Develop and test components in isolation with Storybook.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TypeScript Config</CardTitle>
            <CardDescription>Shared configuration across workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Centralized TypeScript configuration with project references.
            </p>
          </CardContent>
        </Card>
      </Grid>
    </DashboardShell>
  );
}
