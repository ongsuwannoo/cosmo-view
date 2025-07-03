# Role and Permission System Documentation

## Overview

This document describes the comprehensive role and permission system implemented in the UserManagement domain, inspired by Google Cloud IAM. The system provides granular access control with support for:

- **Hierarchical Roles**: System-defined roles with inheritance
- **Resource-level Permissions**: Object-level access control
- **Conditional Access**: Context-based permission evaluation
- **Custom Roles**: Organization-specific role creation
- **Policy Management**: IAM-like policy structure

## Architecture

### Core Components

1. **Types & Interfaces** (`types.ts`)
   - User, Role, Permission, RoleBinding definitions
   - System roles and permission enums
   - Policy structures

2. **Permission Service** (`permissions.ts`)
   - Permission checking logic
   - Context-aware access control
   - Effective permission calculation

3. **Role Service** (`role-service.ts`)
   - Role management operations
   - System role definitions
   - Custom role creation

4. **Domain Services** (`services.ts`)
   - Business logic and validation
   - User management operations
   - Role assignment logic

## System Roles

### Organization Level
- **Organization Administrator** (`roles/organization.admin`)
  - Full access to all resources
  - Can assign any role
  - Manage organization settings

- **Organization Viewer** (`roles/organization.viewer`)
  - Read-only access to organization resources

### User Management
- **User Administrator** (`roles/user.admin`)
  - Full user management capabilities
  - Can assign non-organization roles
  - Access to user audit logs

- **User Manager** (`roles/user.manager`)
  - Manage users within same department
  - Limited role assignment capabilities
  - Invite users to organization

- **User Viewer** (`roles/user.viewer`)
  - Read-only access to user information

### Project Management
- **Project Owner** (`roles/project.owner`)
  - Full project management capabilities
  - Can assign project roles
  - Project resource management

- **Project Editor** (`roles/project.editor`)
  - Edit project resources
  - Cannot manage project access

- **Project Viewer** (`roles/project.viewer`)
  - Read-only access to project resources

### Basic Access
- **Authenticated User** (`roles/authenticated.user`)
  - Basic authenticated user permissions
  - Can view own profile
  - Limited system access

## Permission System

### Resource Types
- `user` - User management
- `project` - Project resources
- `organization` - Organization settings
- `role` - Role management
- `permission` - Permission management
- `billing` - Billing information
- `audit` - Audit logs

### Action Types
- `create` - Create new resources
- `read` - View resource information
- `update` - Modify existing resources
- `delete` - Remove resources
- `manage` - Full management access
- `admin` - Administrative access
- `invite` - Invite users
- `assign_role` - Assign roles to users
- `revoke_role` - Remove roles from users
- `view_audit` - Access audit logs
- `export` - Export data
- `archive` - Archive resources
- `restore` - Restore archived resources

### Permission Examples
```typescript
// Basic permissions
'user.read' - View user information
'user.create' - Create new users
'project.manage' - Full project management

// Conditional permissions
'user.invite' with condition 'department_member' - Invite users to same department
'user.read' with condition 'resource_owner' - View own user profile
```

## Role Bindings

Role bindings connect users to roles with optional resource scope and conditions:

```typescript
interface RoleBinding {
  id: string;
  roleId: string;
  roleName: string;
  resourceType?: ResourceType;  // Optional resource scope
  resourceId?: string;          // Specific resource
  conditions?: BindingCondition[];
  expiresAt?: string;          // Time-based access
  createdAt: string;
  assignedBy: string;
}
```

### Examples

```typescript
// Global organization admin
{
  roleId: 'roles/organization.admin',
  // No resource scope - applies globally
}

// Project-specific owner
{
  roleId: 'roles/project.owner',
  resourceType: 'project',
  resourceId: 'project-123'
}

// Time-limited access
{
  roleId: 'roles/user.manager',
  expiresAt: '2024-12-31T23:59:59Z'
}
```

## Permission Conditions

Conditions allow context-aware permission evaluation:

### Condition Types
- `resource_owner` - User owns the resource
- `department_member` - User belongs to same department
- `organization_member` - User belongs to organization
- `time_based` - Time-based access restrictions
- `ip_based` - IP address restrictions

### Examples

```typescript
// Only allow viewing own profile
{
  type: 'resource_owner',
  value: 'self'
}

// Department-scoped access
{
  type: 'department_member',
  value: 'same_department'
}

// Organization membership required
{
  type: 'organization_member'
}
```

## Usage Examples

### Creating Users with Roles

```typescript
const createUserRequest: CreateUserRequest = {
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  roleBindings: [
    {
      roleId: 'roles/authenticated.user'
    },
    {
      roleId: 'roles/project.editor',
      resourceType: 'project',
      resourceId: 'project-123'
    }
  ]
};
```

### Checking Permissions

```typescript
// Check if user can create users
const canCreate = await canPerformAction(
  user, 
  'user.create'
);

// Check project-specific permission
const canManageProject = await canPerformAction(
  user,
  'project.manage',
  ResourceType.PROJECT,
  'project-123'
);
```

### Managing Role Bindings

```typescript
// Add project role to user
const updates: UpdateRoleBindingRequest[] = [
  {
    action: 'add',
    roleId: 'roles/project.viewer',
    resourceType: ResourceType.PROJECT,
    resourceId: 'project-456',
    expiresAt: '2024-12-31T23:59:59Z'
  }
];

const updatedBindings = updateUserRoleBindings(
  user, 
  updates, 
  'admin-user-id'
);
```

### Creating Custom Roles

```typescript
const customRole = RoleService.createCustomRole(
  'Department Manager',
  'Manages users within specific department',
  [
    createPermissionFromDef(SYSTEM_PERMISSIONS['user.read']),
    createPermissionFromDef(SYSTEM_PERMISSIONS['user.update'], [
      { type: 'department_member', value: 'same_department' }
    ])
  ],
  'org-123',
  'creator-user-id'
);
```

## Migration Guide

### From Simple Roles to Role Bindings

**Before:**
```typescript
interface User {
  role: UserRole; // Single role
}
```

**After:**
```typescript
interface User {
  roleBindings: RoleBinding[]; // Multiple role bindings
}
```

### Migration Steps

1. **Update User Creation**
   ```typescript
   // Old
   const user = { role: UserRole.ADMIN };
   
   // New
   const user = {
     roleBindings: [
       {
         roleId: SYSTEM_ROLES.ORGANIZATION_ADMIN.id,
         // ... other properties
       }
     ]
   };
   ```

2. **Update Permission Checks**
   ```typescript
   // Old
   const canCreate = user.role === UserRole.ADMIN;
   
   // New
   const canCreate = await canPerformAction(user, 'user.create');
   ```

3. **Update Role Assignments**
   ```typescript
   // Old
   user.role = UserRole.MODERATOR;
   
   // New
   const updates = [
     { action: 'add', roleId: SYSTEM_ROLES.USER_MANAGER.id }
   ];
   user.roleBindings = updateUserRoleBindings(user, updates, assignerId);
   ```

## Best Practices

### 1. Principle of Least Privilege
- Assign minimal required permissions
- Use resource-scoped bindings when possible
- Implement time-based access for temporary needs

### 2. Role Hierarchy
- Use system roles as building blocks
- Create custom roles for specific organizational needs
- Avoid overlapping permissions in custom roles

### 3. Conditional Access
- Use conditions to implement fine-grained access control
- Combine multiple conditions for complex scenarios
- Document condition logic clearly

### 4. Audit and Monitoring
- Track all role assignments and permission changes
- Implement regular access reviews
- Monitor for permission escalation

### 5. Testing
- Test permission checks in different contexts
- Verify role inheritance works correctly
- Test time-based and conditional access

## Security Considerations

1. **Role Escalation Prevention**
   - Users cannot assign roles they don't have
   - System roles cannot be modified
   - Administrative actions are logged

2. **Resource Isolation**
   - Resource-scoped permissions prevent cross-contamination
   - Organization boundaries are enforced
   - Department-based access controls

3. **Temporal Access**
   - Time-based role bindings for temporary access
   - Automatic expiration of temporary permissions
   - Regular cleanup of expired bindings

4. **Audit Trail**
   - All permission changes are logged
   - Role assignment history is maintained
   - Failed access attempts are recorded

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Check user's role bindings
   - Verify resource scope matches
   - Ensure conditions are met

2. **Role Assignment Fails**
   - Verify assigner has sufficient permissions
   - Check role hierarchy constraints
   - Validate resource existence

3. **Expired Access**
   - Check for time-based role bindings
   - Verify expiration dates
   - Renew access as needed

### Debug Tools

```typescript
// Get user's effective permissions
const permissions = await getUserPermissions(user);

// Check specific permission
const result = await PermissionService.checkPermission(user, {
  userId: user.id,
  permission: 'user.create',
  context: { department: 'engineering' }
});

// Get available roles for assignment
const availableRoles = await getAvailableRoles(user);
```

## API Reference

See the individual service files for detailed API documentation:

- `PermissionService` - Permission checking and evaluation
- `RoleService` - Role management operations
- Domain service functions - Business logic and validation

## Future Enhancements

1. **Dynamic Permissions** - Runtime permission evaluation
2. **External Identity Integration** - SAML/OAuth role mapping
3. **Advanced Conditions** - Complex condition expressions
4. **Role Templates** - Pre-configured role sets
5. **Bulk Operations** - Batch role assignments
6. **Analytics** - Permission usage analytics
