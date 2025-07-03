# Domain-Driven Design (DDD) Implementation

This is a proof of concept demonstrating Domain-Driven Design principles in a React application with the **User Management** bounded context.

## Architecture Overview

The application follows DDD principles by organizing code into bounded contexts, each containing three main layers:

```
/src/contexts/UserManagement/
├── domain/           # Business logic and rules
├── infrastructure/   # External integrations and data access
└── components/       # UI components specific to this domain
```

## Domain Layer (`/domain`)

The domain layer contains the core business logic and rules for user management:

### Files:
- **`types.ts`** - Domain entities, value objects, and interfaces
- **`services.ts`** - Business logic functions and domain rules
- **`store.ts`** - State management using Zustand with domain-specific actions

### Key Features:
- **Domain Entities**: User, UserProfile, UserRole, UserStatus
- **Business Rules**: User validation, permission checks, status transitions
- **State Management**: Centralized state with domain-specific actions
- **Domain Events**: Event-driven architecture for loose coupling

### Example API Usage:
```typescript
// Domain services
import { validateUserCreation, canPerformAction } from './domain/services';

// Domain state
import { useUserManagementStore } from './domain/store';

// Domain types
import { User, UserRole, UserStatus } from './domain/types';
```

## Infrastructure Layer (`/infrastructure`)

The infrastructure layer handles external integrations and data access:

### Files:
- **`repository.ts`** - API client following repository pattern
- **`hooks.ts`** - React Query hooks for API integration

### Key Features:
- **Repository Pattern**: Abstracts API calls behind domain interfaces
- **React Query Integration**: Caching, synchronization, and error handling
- **API Client**: RESTful API communication with proper error handling
- **Data Transformation**: Converts between API and domain models

### Example API Usage:
```typescript
// API hooks
import { useUsers, useCreateUser, useUpdateUser } from './infrastructure/hooks';

// Repository (rarely used directly)
import { userRepository } from './infrastructure/repository';

// Usage in components
const { data, isLoading, error } = useUsers({ role: UserRole.ADMIN });
const createUser = useCreateUser();
```

## Components Layer (`/components`)

The components layer contains UI components specific to the user management domain:

### Files:
- **`UserManagementDashboard.tsx`** - Main dashboard component
- **`UserCard.tsx`** - Individual user display component
- **`UserFilters.tsx`** - Filtering controls component
- **`UserModal.tsx`** - User creation/editing modal
- **`UserManagement.module.css`** - Domain-specific styles

### Key Features:
- **Domain-Specific UI**: Components tailored to user management concepts
- **CSS Modules**: Scoped styles with domain-specific naming
- **Separation of Concerns**: UI logic separated from business logic
- **Reusable Patterns**: Consistent UI patterns across the domain

### Example Component Usage:
```typescript
// Main dashboard
import { UserManagementDashboard } from './components/UserManagementDashboard';

// Individual components
import { UserCard, UserFilters, UserModal } from './components';

// Usage
<UserManagementDashboard />
```

## How to Call APIs

### 1. Using React Query Hooks (Recommended)

```typescript
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from './infrastructure/hooks';

function MyComponent() {
  // Fetch users with filtering
  const { data: users, isLoading, error } = useUsers({ 
    role: UserRole.ADMIN, 
    status: UserStatus.ACTIVE 
  });

  // Create user mutation
  const createUser = useCreateUser();
  
  const handleCreateUser = async (userData) => {
    try {
      await createUser.mutateAsync(userData);
      console.log('User created successfully');
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };
}
```

### 2. Direct Repository Usage (For Advanced Cases)

```typescript
import { userRepository } from './infrastructure/repository';

// Direct API calls (use sparingly)
const users = await userRepository.getUsers({ role: UserRole.ADMIN });
const newUser = await userRepository.createUser(userData);
```

## How to Set State for Domain

### 1. Using Domain Store Actions

```typescript
import { useUserManagementStore } from './domain/store';

function MyComponent() {
  const { 
    users, 
    selectedUser, 
    filters,
    setUsers,
    setSelectedUser,
    setFilters,
    addUser,
    updateUser,
    removeUser
  } = useUserManagementStore();

  // Set filters
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Select a user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  // Add a new user to state
  const handleAddUser = (user) => {
    addUser(user);
  };
}
```

### 2. Using Selector Hooks

```typescript
import { 
  useSelectedUser, 
  useUserFilters, 
  useFilteredUsers,
  useUserLoading,
  useUserError 
} from './domain/store';

function MyComponent() {
  const selectedUser = useSelectedUser();
  const filters = useUserFilters();
  const filteredUsers = useFilteredUsers();
  const loading = useUserLoading();
  const error = useUserError();
}
```

## How to Separate UI Code for Domain

### 1. Domain-Specific Components

Each domain has its own component library with domain-specific styling:

```typescript
// User Management specific components
import { UserCard, UserFilters, UserModal } from './components';

// Domain-specific styles
import styles from './components/UserManagement.module.css';

function UserCard({ user }) {
  return (
    <div className={styles['user-card']}>
      <div className={styles['user-info']}>
        <h3 className={styles['user-name']}>{user.name}</h3>
        <span className={styles['user-role']}>{user.role}</span>
      </div>
    </div>
  );
}
```

### 2. Custom CSS Modules

Domain-specific styles are organized in CSS modules:

```css
/* UserManagement.module.css */
.user-card {
  @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow;
}

.user-role-admin {
  @apply bg-red-100 text-red-800;
}

.user-role-user {
  @apply bg-green-100 text-green-800;
}
```

### 3. Domain-Specific Hooks

Create hooks that encapsulate domain-specific UI logic:

```typescript
// Domain-specific UI hooks
export function useUserPermissions(currentUser: User) {
  const canCreate = canPerformAction(currentUser, 'CREATE_USER');
  const canUpdate = canPerformAction(currentUser, 'UPDATE_USER');
  const canDelete = canPerformAction(currentUser, 'DELETE_USER');
  
  return { canCreate, canUpdate, canDelete };
}

export function useUserStatusColor(status: UserStatus) {
  return getStatusColor(status);
}
```

## Benefits of This Architecture

1. **Separation of Concerns**: Clear boundaries between business logic, data access, and UI
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Changes to one layer don't affect others
4. **Scalability**: Easy to add new domains without affecting existing ones
5. **Domain Focus**: Code is organized around business concepts, not technical concerns

## Getting Started

To use this User Management context in your application:

1. Import the main dashboard component:
```typescript
import { UserManagementDashboard } from './contexts/UserManagement';
```

2. Use it in your application:
```typescript
function App() {
  return (
    <div>
      <UserManagementDashboard />
    </div>
  );
}
```

3. Access domain functionality:
```typescript
// Domain services
import { validateUserCreation, canPerformAction } from './contexts/UserManagement';

// API hooks
import { useUsers, useCreateUser } from './contexts/UserManagement';

// State management
import { useUserManagementStore } from './contexts/UserManagement';
```

This implementation demonstrates how to structure a React application using Domain-Driven Design principles, providing a clear separation between business logic, data access, and user interface concerns.
