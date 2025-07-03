import { Dashboard } from '@/pages/dashboard';
import { FormDemoPage } from '@/pages/form-demo';
import { DataTablePage } from '@/pages/data-table';
import { UserManagementDemo } from '@/pages/user-management-demo';
import { useAuthStore } from '@/stores/auth';
import { AuthPage } from '@cosmo-view/ui';
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => {
    const { user } = useAuthStore();

    if (!user) {
      return (
        <AuthPage
          onLogin={async ({ email, password }) => {
            await useAuthStore.getState().login(email, password);
          }}
        />
      );
    }

    return <Outlet />;
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const formDemoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forms',
  component: FormDemoPage,
});

const dataTableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/table',
  component: DataTablePage,
});

const userManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user-management',
  component: UserManagementDemo,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  formDemoRoute,
  dataTableRoute,
  userManagementRoute,
]);

export const router = createRouter({ routeTree });
