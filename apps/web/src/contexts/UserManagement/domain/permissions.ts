/**
 * Permission Management Service
 * Inspired by Google Cloud IAM for comprehensive permission management
 */

import {
  type Permission,
  type PermissionCheckRequest,
  type PermissionCheckResponse,
  type PermissionContext,
  type User,
  type RoleBinding,
  type PermissionCondition,
  ResourceType,
  ActionType,
  SYSTEM_ROLES,
} from './types';

/**
 * Predefined permissions based on Google Cloud IAM patterns
 */
export const SYSTEM_PERMISSIONS = {
  // Organization permissions
  'organization.admin': {
    id: 'organization.admin',
    name: 'Organization Administrator',
    description: 'Full administrative access to organization',
    resource: ResourceType.ORGANIZATION,
    action: ActionType.ADMIN,
  },
  'organization.read': {
    id: 'organization.read',
    name: 'Organization Reader',
    description: 'Read access to organization information',
    resource: ResourceType.ORGANIZATION,
    action: ActionType.READ,
  },

  // User management permissions
  'user.create': {
    id: 'user.create',
    name: 'Create Users',
    description: 'Create new users in the system',
    resource: ResourceType.USER,
    action: ActionType.CREATE,
  },
  'user.read': {
    id: 'user.read',
    name: 'Read Users',
    description: 'View user information',
    resource: ResourceType.USER,
    action: ActionType.READ,
  },
  'user.update': {
    id: 'user.update',
    name: 'Update Users',
    description: 'Update user information',
    resource: ResourceType.USER,
    action: ActionType.UPDATE,
  },
  'user.delete': {
    id: 'user.delete',
    name: 'Delete Users',
    description: 'Delete users from the system',
    resource: ResourceType.USER,
    action: ActionType.DELETE,
  },
  'user.invite': {
    id: 'user.invite',
    name: 'Invite Users',
    description: 'Invite new users to the organization',
    resource: ResourceType.USER,
    action: ActionType.INVITE,
  },
  'user.assignRole': {
    id: 'user.assignRole',
    name: 'Assign Roles',
    description: 'Assign roles to users',
    resource: ResourceType.USER,
    action: ActionType.ASSIGN_ROLE,
  },
  'user.revokeRole': {
    id: 'user.revokeRole',
    name: 'Revoke Roles',
    description: 'Revoke roles from users',
    resource: ResourceType.USER,
    action: ActionType.REVOKE_ROLE,
  },

  // Project permissions
  'project.create': {
    id: 'project.create',
    name: 'Create Projects',
    description: 'Create new projects',
    resource: ResourceType.PROJECT,
    action: ActionType.CREATE,
  },
  'project.read': {
    id: 'project.read',
    name: 'Read Projects',
    description: 'View project information',
    resource: ResourceType.PROJECT,
    action: ActionType.READ,
  },
  'project.update': {
    id: 'project.update',
    name: 'Update Projects',
    description: 'Update project information',
    resource: ResourceType.PROJECT,
    action: ActionType.UPDATE,
  },
  'project.delete': {
    id: 'project.delete',
    name: 'Delete Projects',
    description: 'Delete projects',
    resource: ResourceType.PROJECT,
    action: ActionType.DELETE,
  },
  'project.manage': {
    id: 'project.manage',
    name: 'Manage Projects',
    description: 'Full management access to projects',
    resource: ResourceType.PROJECT,
    action: ActionType.MANAGE,
  },

  // Role management permissions
  'role.create': {
    id: 'role.create',
    name: 'Create Roles',
    description: 'Create custom roles',
    resource: ResourceType.ROLE,
    action: ActionType.CREATE,
  },
  'role.read': {
    id: 'role.read',
    name: 'Read Roles',
    description: 'View role information',
    resource: ResourceType.ROLE,
    action: ActionType.READ,
  },
  'role.update': {
    id: 'role.update',
    name: 'Update Roles',
    description: 'Update role information',
    resource: ResourceType.ROLE,
    action: ActionType.UPDATE,
  },
  'role.delete': {
    id: 'role.delete',
    name: 'Delete Roles',
    description: 'Delete custom roles',
    resource: ResourceType.ROLE,
    action: ActionType.DELETE,
  },

  // Audit permissions
  'audit.read': {
    id: 'audit.read',
    name: 'Read Audit Logs',
    description: 'View audit logs',
    resource: ResourceType.AUDIT,
    action: ActionType.VIEW_AUDIT,
  },

  // Billing permissions
  'billing.read': {
    id: 'billing.read',
    name: 'Read Billing',
    description: 'View billing information',
    resource: ResourceType.BILLING,
    action: ActionType.READ,
  },
  'billing.update': {
    id: 'billing.update',
    name: 'Update Billing',
    description: 'Update billing information',
    resource: ResourceType.BILLING,
    action: ActionType.UPDATE,
  },
} as const;

/**
 * Permission service for checking user permissions
 */
export namespace PermissionService {
  /**
   * Check if a user has a specific permission
   */
  export async function checkPermission(
    user: User,
    request: PermissionCheckRequest
  ): Promise<PermissionCheckResponse> {
    // Check direct permissions first
    if (user.directPermissions) {
      const hasDirectPermission = user.directPermissions.some(
        (permission) => permission.name === request.permission
      );
      if (hasDirectPermission) {
        return { granted: true, reason: 'Direct permission granted' };
      }
    }

    // Check role-based permissions
    const rolePermissions = await getRolePermissions(user.roleBindings);

    for (const permission of rolePermissions) {
      if (permission.name === request.permission) {
        // Check resource scope
        if (request.resourceType && request.resourceId) {
          const hasResourceAccess = await checkResourceAccess(
            user,
            request.resourceType,
            request.resourceId
          );
          if (!hasResourceAccess) {
            continue;
          }
        }

        // Check permission conditions
        if (permission.conditions) {
          const conditionsMet = await checkPermissionConditions(
            user,
            permission.conditions,
            request.context
          );
          if (!conditionsMet) {
            continue;
          }
        }

        return { granted: true, reason: 'Role-based permission granted' };
      }
    }

    return { granted: false, reason: 'Permission not found' };
  }

  /**
   * Get all permissions for a user's role bindings
   */
  async function getRolePermissions(roleBindings: RoleBinding[]): Promise<Permission[]> {
    const permissions: Permission[] = [];

    for (const binding of roleBindings) {
      // Check if binding is expired
      if (binding.expiresAt && new Date(binding.expiresAt) < new Date()) {
        continue;
      }

      // Get role permissions (this would typically fetch from a database)
      const rolePermissions = await getPermissionsForRole(binding.roleId);
      permissions.push(...rolePermissions);
    }

    return permissions;
  }

  /**
   * Get permissions for a specific role
   */
  async function getPermissionsForRole(roleId: string): Promise<Permission[]> {
    // This would typically fetch from a database
    // For now, return predefined permissions based on system roles
    const permissions: Permission[] = [];

    switch (roleId) {
      case SYSTEM_ROLES.ORGANIZATION_ADMIN.id:
        permissions.push(
          createPermission(SYSTEM_PERMISSIONS['organization.admin']),
          createPermission(SYSTEM_PERMISSIONS['user.create']),
          createPermission(SYSTEM_PERMISSIONS['user.read']),
          createPermission(SYSTEM_PERMISSIONS['user.update']),
          createPermission(SYSTEM_PERMISSIONS['user.delete']),
          createPermission(SYSTEM_PERMISSIONS['user.invite']),
          createPermission(SYSTEM_PERMISSIONS['user.assignRole']),
          createPermission(SYSTEM_PERMISSIONS['user.revokeRole']),
          createPermission(SYSTEM_PERMISSIONS['project.create']),
          createPermission(SYSTEM_PERMISSIONS['project.read']),
          createPermission(SYSTEM_PERMISSIONS['project.update']),
          createPermission(SYSTEM_PERMISSIONS['project.delete']),
          createPermission(SYSTEM_PERMISSIONS['project.manage']),
          createPermission(SYSTEM_PERMISSIONS['role.create']),
          createPermission(SYSTEM_PERMISSIONS['role.read']),
          createPermission(SYSTEM_PERMISSIONS['role.update']),
          createPermission(SYSTEM_PERMISSIONS['role.delete']),
          createPermission(SYSTEM_PERMISSIONS['audit.read']),
          createPermission(SYSTEM_PERMISSIONS['billing.read']),
          createPermission(SYSTEM_PERMISSIONS['billing.update'])
        );
        break;

      case SYSTEM_ROLES.USER_ADMIN.id:
        permissions.push(
          createPermission(SYSTEM_PERMISSIONS['user.create']),
          createPermission(SYSTEM_PERMISSIONS['user.read']),
          createPermission(SYSTEM_PERMISSIONS['user.update']),
          createPermission(SYSTEM_PERMISSIONS['user.delete']),
          createPermission(SYSTEM_PERMISSIONS['user.invite']),
          createPermission(SYSTEM_PERMISSIONS['user.assignRole']),
          createPermission(SYSTEM_PERMISSIONS['user.revokeRole'])
        );
        break;

      case SYSTEM_ROLES.USER_MANAGER.id:
        permissions.push(
          createPermission(SYSTEM_PERMISSIONS['user.read']),
          createPermission(SYSTEM_PERMISSIONS['user.update']),
          createPermission(SYSTEM_PERMISSIONS['user.invite'], [
            { type: 'department_member', value: 'same_department' },
          ])
        );
        break;

      case SYSTEM_ROLES.USER_VIEWER.id:
        permissions.push(createPermission(SYSTEM_PERMISSIONS['user.read']));
        break;

      case SYSTEM_ROLES.PROJECT_OWNER.id:
        permissions.push(
          createPermission(SYSTEM_PERMISSIONS['project.create']),
          createPermission(SYSTEM_PERMISSIONS['project.read']),
          createPermission(SYSTEM_PERMISSIONS['project.update']),
          createPermission(SYSTEM_PERMISSIONS['project.delete']),
          createPermission(SYSTEM_PERMISSIONS['project.manage'])
        );
        break;

      case SYSTEM_ROLES.PROJECT_EDITOR.id:
        permissions.push(
          createPermission(SYSTEM_PERMISSIONS['project.read']),
          createPermission(SYSTEM_PERMISSIONS['project.update'])
        );
        break;

      case SYSTEM_ROLES.PROJECT_VIEWER.id:
        permissions.push(createPermission(SYSTEM_PERMISSIONS['project.read']));
        break;

      case SYSTEM_ROLES.AUTHENTICATED_USER.id:
        permissions.push(
          createPermission(SYSTEM_PERMISSIONS['user.read'], [
            { type: 'resource_owner', value: 'self' },
          ])
        );
        break;

      default:
        // For custom roles, this would fetch from the database
        break;
    }

    return permissions;
  }

  /**
   * Create a permission object
   */
  function createPermission(
    permissionDef: (typeof SYSTEM_PERMISSIONS)[keyof typeof SYSTEM_PERMISSIONS],
    conditions?: PermissionCondition[]
  ): Permission {
    return {
      id: permissionDef.id,
      name: permissionDef.name,
      description: permissionDef.description,
      resource: permissionDef.resource,
      action: permissionDef.action,
      ...(conditions && { conditions }),
    };
  }

  /**
   * Check if user has access to a specific resource
   */
  async function checkResourceAccess(
    user: User,
    resourceType: ResourceType,
    resourceId: string
  ): Promise<boolean> {
    // Check if user has role binding scoped to this resource
    const hasResourceBinding = user.roleBindings.some(
      (binding) => binding.resourceType === resourceType && binding.resourceId === resourceId
    );

    if (hasResourceBinding) {
      return true;
    }

    // Check if user has global permissions for this resource type
    const hasGlobalBinding = user.roleBindings.some(
      (binding) => !binding.resourceType || binding.resourceType === resourceType
    );

    return hasGlobalBinding;
  }

  /**
   * Check if permission conditions are met
   */
  async function checkPermissionConditions(
    user: User,
    conditions: PermissionCondition[],
    context?: PermissionContext
  ): Promise<boolean> {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'resource_owner':
          if (condition.value === 'self' && context?.resourceOwnerId !== user.id) {
            return false;
          }
          break;

        case 'department_member':
          if (
            condition.value === 'same_department' &&
            context?.department !== user.profile?.department
          ) {
            return false;
          }
          break;

        case 'organization_member':
          if (
            context?.organizationId &&
            !user.roleBindings.some(
              (binding) =>
                binding.resourceType === ResourceType.ORGANIZATION &&
                binding.resourceId === context.organizationId
            )
          ) {
            return false;
          }
          break;

        case 'time_based':
          // Implement time-based conditions
          break;

        case 'ip_based':
          // Implement IP-based conditions
          break;

        default:
          return false;
      }
    }

    return true;
  }

  /**
   * Get effective permissions for a user
   */
  export async function getEffectivePermissions(user: User): Promise<Permission[]> {
    const permissions: Permission[] = [];

    // Add direct permissions
    if (user.directPermissions) {
      permissions.push(...user.directPermissions);
    }

    // Add role-based permissions
    const rolePermissions = await getRolePermissions(user.roleBindings);
    permissions.push(...rolePermissions);

    // Remove duplicates
    const uniquePermissions = permissions.filter(
      (permission, index, self) => index === self.findIndex((p) => p.id === permission.id)
    );

    return uniquePermissions;
  }
}
