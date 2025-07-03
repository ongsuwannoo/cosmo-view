/**
 * Role Management Service
 * Handles role creation, management, and assignment
 */

import {
  type Role,
  type Permission,
  type PermissionCondition,
  type Policy,
  type PolicyBinding,
  RoleType,
  SYSTEM_ROLES,
} from './types';
import { SYSTEM_PERMISSIONS } from './permissions';

/**
 * Role management service
 */
export namespace RoleService {
  /**
   * Create a custom role
   */
  export function createCustomRole(
    name: string,
    description: string,
    permissions: Permission[],
    organizationId?: string,
    createdBy?: string
  ): Role {
    return {
      id: generateRoleId(name),
      name,
      description,
      type: RoleType.CUSTOM,
      permissions,
      ...(organizationId && { organizationId }),
      isSystemRole: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(createdBy && { createdBy }),
    };
  }

  /**
   * Get all system roles
   */
  export function getSystemRoles(): Role[] {
    return Object.values(SYSTEM_ROLES).map((roleInfo) => ({
      id: roleInfo.id,
      name: roleInfo.name,
      description: roleInfo.description,
      type: roleInfo.type,
      permissions: getSystemRolePermissions(roleInfo.id),
      isSystemRole: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }));
  }

  /**
   * Get permissions for a system role
   */
  export function getSystemRolePermissions(roleId: string): Permission[] {
    const permissions: Permission[] = [];

    switch (roleId) {
      case SYSTEM_ROLES.ORGANIZATION_ADMIN.id:
        permissions.push(
          ...Object.values(SYSTEM_PERMISSIONS).map((perm) => createPermissionFromDef(perm))
        );
        break;

      case SYSTEM_ROLES.USER_ADMIN.id:
        permissions.push(
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.create']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.read']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.update']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.delete']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.invite']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.assignRole']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.revokeRole']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['role.read'])
        );
        break;

      case SYSTEM_ROLES.USER_MANAGER.id:
        permissions.push(
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.read']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.update']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.invite'], [
            { type: 'department_member', value: 'same_department' },
          ])
        );
        break;

      case SYSTEM_ROLES.USER_VIEWER.id:
        permissions.push(createPermissionFromDef(SYSTEM_PERMISSIONS['user.read']));
        break;

      case SYSTEM_ROLES.PROJECT_OWNER.id:
        permissions.push(
          createPermissionFromDef(SYSTEM_PERMISSIONS['project.create']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['project.read']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['project.update']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['project.delete']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['project.manage'])
        );
        break;

      case SYSTEM_ROLES.PROJECT_EDITOR.id:
        permissions.push(
          createPermissionFromDef(SYSTEM_PERMISSIONS['project.read']),
          createPermissionFromDef(SYSTEM_PERMISSIONS['project.update'])
        );
        break;

      case SYSTEM_ROLES.PROJECT_VIEWER.id:
        permissions.push(createPermissionFromDef(SYSTEM_PERMISSIONS['project.read']));
        break;

      case SYSTEM_ROLES.AUTHENTICATED_USER.id:
        permissions.push(
          createPermissionFromDef(SYSTEM_PERMISSIONS['user.read'], [
            { type: 'resource_owner', value: 'self' },
          ])
        );
        break;
    }

    return permissions;
  }

  /**
   * Create a role from a template
   */
  export function createRoleFromTemplate(
    templateRoleId: string,
    name: string,
    description: string,
    organizationId?: string,
    createdBy?: string
  ): Role {
    const templatePermissions = getSystemRolePermissions(templateRoleId);

    return createCustomRole(name, description, templatePermissions, organizationId, createdBy);
  }

  /**
   * Update a custom role
   */
  export function updateCustomRole(
    role: Role,
    updates: {
      name?: string;
      description?: string;
      permissions?: Permission[];
    }
  ): Role {
    if (role.isSystemRole) {
      throw new Error('Cannot update system roles');
    }

    return {
      ...role,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Delete a custom role
   */
  export function deleteCustomRole(role: Role): void {
    if (role.isSystemRole) {
      throw new Error('Cannot delete system roles');
    }
    // In a real implementation, this would handle cleanup
  }

  /**
   * Check if a role can be assigned by a user
   */
  export function canAssignRole(assignerRoleIds: string[], targetRoleId: string): boolean {
    // Organization admins can assign any role
    if (assignerRoleIds.includes(SYSTEM_ROLES.ORGANIZATION_ADMIN.id)) {
      return true;
    }

    // User admins can assign non-organization roles
    if (assignerRoleIds.includes(SYSTEM_ROLES.USER_ADMIN.id)) {
      return !targetRoleId.includes('organization');
    }

    // User managers can assign basic roles
    if (assignerRoleIds.includes(SYSTEM_ROLES.USER_MANAGER.id)) {
      return (
        targetRoleId === SYSTEM_ROLES.USER_VIEWER.id ||
        targetRoleId === SYSTEM_ROLES.AUTHENTICATED_USER.id
      );
    }

    return false;
  }

  /**
   * Get role hierarchy
   */
  export function getRoleHierarchy(): Record<string, string[]> {
    return {
      [SYSTEM_ROLES.ORGANIZATION_ADMIN.id]: [
        SYSTEM_ROLES.USER_ADMIN.id,
        SYSTEM_ROLES.PROJECT_OWNER.id,
      ],
      [SYSTEM_ROLES.USER_ADMIN.id]: [SYSTEM_ROLES.USER_MANAGER.id, SYSTEM_ROLES.USER_VIEWER.id],
      [SYSTEM_ROLES.PROJECT_OWNER.id]: [
        SYSTEM_ROLES.PROJECT_EDITOR.id,
        SYSTEM_ROLES.PROJECT_VIEWER.id,
      ],
      [SYSTEM_ROLES.USER_MANAGER.id]: [
        SYSTEM_ROLES.USER_VIEWER.id,
        SYSTEM_ROLES.AUTHENTICATED_USER.id,
      ],
      [SYSTEM_ROLES.PROJECT_EDITOR.id]: [
        SYSTEM_ROLES.PROJECT_VIEWER.id,
        SYSTEM_ROLES.AUTHENTICATED_USER.id,
      ],
      [SYSTEM_ROLES.USER_VIEWER.id]: [SYSTEM_ROLES.AUTHENTICATED_USER.id],
      [SYSTEM_ROLES.PROJECT_VIEWER.id]: [SYSTEM_ROLES.AUTHENTICATED_USER.id],
    };
  }

  /**
   * Check if one role inherits from another
   */
  export function inheritsFrom(childRoleId: string, parentRoleId: string): boolean {
    const hierarchy = getRoleHierarchy();

    function checkInheritance(roleId: string, targetId: string): boolean {
      if (roleId === targetId) return true;

      const parents = Object.entries(hierarchy).filter(([, children]) => children.includes(roleId));

      return parents.some(([parentId]) => checkInheritance(parentId, targetId));
    }

    return checkInheritance(childRoleId, parentRoleId);
  }

  /**
   * Get effective permissions for multiple roles
   */
  export function getEffectivePermissions(roleIds: string[]): Permission[] {
    const allPermissions: Permission[] = [];

    for (const roleId of roleIds) {
      const rolePermissions = getSystemRolePermissions(roleId);
      allPermissions.push(...rolePermissions);
    }

    // Remove duplicates
    return allPermissions.filter(
      (permission, index, self) => index === self.findIndex((p) => p.id === permission.id)
    );
  }

  /**
   * Create IAM policy for roles
   */
  export function createIAMPolicy(
    roleBindings: Array<{
      roleId: string;
      members: string[];
      resourceType?: string;
      resourceId?: string;
    }>
  ): Policy {
    const bindings: PolicyBinding[] = roleBindings.map((binding) => ({
      role: binding.roleId,
      members: binding.members,
      ...(binding.resourceType &&
        binding.resourceId && {
          condition: {
            title: 'Resource Access',
            description: `Access to ${binding.resourceType}:${binding.resourceId}`,
            expression: `resource.type == "${binding.resourceType}" && resource.id == "${binding.resourceId}"`,
          },
        }),
    }));

    return {
      version: '1',
      bindings,
    };
  }

  /**
   * Validate role permissions
   */
  export function validateRolePermissions(
    permissions: Permission[],
    roleType: RoleType
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (permissions.length === 0) {
      errors.push('Role must have at least one permission');
    }

    // Check for conflicting permissions
    const adminPermissions = permissions.filter((p) => p.action === 'admin');
    const specificPermissions = permissions.filter((p) => p.action !== 'admin');

    if (adminPermissions.length > 0 && specificPermissions.length > 0) {
      errors.push('Cannot mix admin permissions with specific permissions');
    }

    // Custom roles cannot have organization-level permissions
    if (roleType === RoleType.CUSTOM) {
      const orgPermissions = permissions.filter(
        (p) => p.resource === 'organization' || p.name.includes('organization')
      );
      if (orgPermissions.length > 0) {
        errors.push('Custom roles cannot have organization-level permissions');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Helper function to create permission from definition
 */
function createPermissionFromDef(
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
 * Generate a unique role ID
 */
function generateRoleId(name: string): string {
  const timestamp = Date.now();
  const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `roles/${sanitized}-${timestamp}`;
}
