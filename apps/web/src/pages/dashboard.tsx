import { useAuthStore } from '@/stores/auth';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, DashboardShell, StatCard } from '@cosmo-view/ui';
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
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8'>
        <StatCard
          title="Total Projects"
          value="12"
          description="Active projects"
          trend={{ value: 20, label: "from last month", isPositive: true }}
        />
        <StatCard
          title="Completed Tasks"
          value="89"
          description="This month"
          trend={{ value: 12, label: "from last month", isPositive: true }}
        />
        <StatCard
          title="Team Members"
          value="8"
          description="Active members"
        />
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
            <CardTitle>Component Library</CardTitle>
            <CardDescription>
              Browse our Component-Driven Development architecture
            </CardDescription>
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
      </div>
    </DashboardShell>
  );
}
