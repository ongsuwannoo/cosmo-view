# Component-Driven Development: Forms and Dashboards Best Practices

## Overview

This guide outlines best practices for organizing forms and dashboards in a Component-Driven Development (CDD) architecture within a monorepo structure.

## Component Organization Strategy

### ✅ SHOULD Move to UI Package

#### Forms:
- **Generic form patterns** (e.g., `GenericForm`, `FormBuilder`)
- **Reusable form components** (e.g., `LoginForm`, `ContactForm`)
- **Form building blocks** (e.g., `FormInput`, `FormSelect`, `FormTextarea`)
- **Form layouts** (e.g., `FormCard`, `FormGrid`)

#### Dashboards:
- **Dashboard shells/layouts** (e.g., `DashboardShell`, `DashboardHeader`)
- **Reusable widgets** (e.g., `StatCard`, `ChartWidget`, `MetricCard`)
- **Navigation components** (e.g., `DashboardSidebar`, `DashboardTabs`)
- **Grid layouts** (e.g., `DashboardGrid`, `ResponsiveGrid`)

### ❌ SHOULD NOT Move to UI Package

#### Forms:
- **Business-specific forms** with domain logic
- **Forms with API integrations** and data fetching
- **Workflow-specific forms** tied to business processes
- **Forms with complex validation rules** specific to your app

#### Dashboards:
- **Complete dashboard pages** with business logic
- **Data-fetching logic** and API integrations
- **Business-specific metrics** and KPIs
- **User permission-specific dashboards**

## Implementation Examples

### ✅ Good: Reusable Dashboard Shell (UI Package)

```tsx
// packages/ui/src/components/features/dashboard-shell/
interface DashboardShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  user?: { name: string; email: string };
  onLogout?: () => void;
}

export function DashboardShell({ children, title, subtitle, user, onLogout }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          {/* Reusable header logic */}
        </header>
        {children}
      </div>
    </div>
  );
}
```

### ✅ Good: Reusable Stat Card (UI Package)

```tsx
// packages/ui/src/components/features/stat-card/
interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
}

export function StatCard({ title, value, trend }: StatCardProps) {
  // Reusable stat card implementation
}
```

### ❌ Bad: Business-Specific Dashboard (Should stay in app)

```tsx
// apps/web/src/pages/dashboard.tsx - CORRECT LOCATION
export function Dashboard() {
  const { user, logout } = useAuthStore(); // App-specific store
  const { data: projects } = useProjectsQuery(); // App-specific API
  
  return (
    <DashboardShell title="Welcome" user={user} onLogout={logout}>
      {/* Business-specific content */}
      <ProjectManagementWidget projects={projects} />
      <UserSpecificMetrics userId={user.id} />
    </DashboardShell>
  );
}
```

## Directory Structure

```
packages/ui/src/components/
├── base/                    # Primitive components
│   ├── button/
│   ├── input/
│   └── card/
├── composed/                # Combinations of base components
│   └── form-field/
├── features/                # Business-agnostic features
│   ├── login-form/         ✅ Generic login form
│   ├── dashboard-shell/    ✅ Dashboard layout
│   ├── stat-card/          ✅ Metric display widget
│   ├── generic-form/       ✅ Form builder pattern
│   └── data-table/         ✅ Reusable table component
└── pages/                   # Complete page templates
    └── auth-page/          ✅ Generic auth page

apps/web/src/
├── components/              # App-specific components
│   ├── forms/              ❌ Business-specific forms
│   │   ├── UserProfileForm.tsx
│   │   ├── ProjectCreateForm.tsx
│   │   └── PaymentForm.tsx
│   └── dashboard/          ❌ Business-specific widgets
│       ├── ProjectsWidget.tsx
│       ├── RevenueChart.tsx
│       └── UserActivityFeed.tsx
└── pages/                  ❌ Complete business pages
    ├── dashboard.tsx
    ├── projects.tsx
    └── settings.tsx
```

## Decision Framework

When deciding whether a component should go in the UI package, ask:

### 1. **Reusability**: 
- Will this component be used across multiple apps?
- Is it generic enough for different business contexts?

### 2. **Dependencies**:
- Does it depend on app-specific APIs or state?
- Does it contain business logic?

### 3. **Customization**:
- Can it be configured via props?
- Is the styling theme-agnostic?

### 4. **Abstraction Level**:
- Is it a fundamental UI pattern?
- Or is it specific to your business domain?

## Migration Strategy

### Phase 1: Extract Layout Components
1. Move `DashboardShell` to UI package
2. Move `StatCard` and similar widgets to UI package
3. Update apps to use new components

### Phase 2: Extract Generic Forms
1. Create `GenericForm` pattern in UI package
2. Extract form field components
3. Keep business forms in apps, use UI building blocks

### Phase 3: Create Storybook Documentation
1. Document all UI package components
2. Create interactive examples
3. Establish design system guidelines

## Benefits of This Approach

1. **Consistency**: Shared components ensure consistent UX
2. **Maintainability**: Single source of truth for common patterns
3. **Testability**: Isolated components are easier to test
4. **Documentation**: Storybook provides living documentation
5. **Flexibility**: Apps can compose components for specific needs

## Anti-Patterns to Avoid

❌ **Don't** put API calls in UI package components
❌ **Don't** include business validation logic in generic forms
❌ **Don't** hardcode business-specific text or values
❌ **Don't** tightly couple UI components to specific state managers
❌ **Don't** include routing logic in UI package components

## Conclusion

The key is finding the right balance between reusability and flexibility. Components in the UI package should be **building blocks** that apps can compose to create business-specific experiences, not complete solutions that limit customization.
