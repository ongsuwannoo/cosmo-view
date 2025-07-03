/**
 * Domain Services for User Management Context
 * Contains business logic and domain rules
 * Updated to use comprehensive role and permission system
 */

import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  RoleBinding,
  CreateRoleBindingRequest,
  UpdateRoleBindingRequest,
  ResourceType,
} from './types';
import { UserStatus, SYSTEM_ROLES } from './types';
import { PermissionService } from './permissions';

/**
 * Validates if a user can be created with the given data
 */
export function validateUserCreation(request: CreateUserRequest): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!request.email || !isValidEmail(request.email)) {
    errors.push('Valid email is required');
  }

  if (!request.firstName?.trim()) {
    errors.push('First name is required');
  }

  if (!request.lastName?.trim()) {
    errors.push('Last name is required');
  }

  if (!request.roleBindings || request.roleBindings.length === 0) {
    errors.push('At least one role binding is required');
  }

  // Validate role bindings
  if (request.roleBindings) {
    for (const binding of request.roleBindings) {
      if (!binding.roleId?.trim()) {
        errors.push('Role ID is required for each role binding');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates if a user can be updated with the given data
 */
export function validateUserUpdate(
  currentUser: User,
  request: UpdateUserRequest
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (request.firstName !== undefined && !request.firstName.trim()) {
    errors.push('First name cannot be empty');
  }

  if (request.lastName !== undefined && !request.lastName.trim()) {
    errors.push('Last name cannot be empty');
  }

  if (request.status !== undefined && !Object.values(UserStatus).includes(request.status)) {
    errors.push('Valid user status is required');
  }

  // Validate role binding updates
  if (request.roleBindings) {
    for (const binding of request.roleBindings) {
      if (!binding.roleId?.trim()) {
        errors.push('Role ID is required for each role binding');
      }
      if (!['add', 'remove', 'update'].includes(binding.action)) {
        errors.push('Valid action (add, remove, update) is required for each role binding');
      }
    }
  }

  // Business rule: Cannot change own critical roles
  if (request.roleBindings) {
    const adminRoleUpdate = request.roleBindings.find(
      (binding) =>
        binding.roleId === SYSTEM_ROLES.ORGANIZATION_ADMIN.id && binding.action === 'remove'
    );
    if (adminRoleUpdate && hasRole(currentUser, SYSTEM_ROLES.ORGANIZATION_ADMIN.id)) {
      errors.push('Cannot remove own organization admin role');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Determines if a user can perform specific actions based on their permissions
 */
export async function canPerformAction(
  user: User,
  action: string,
  resourceType?: ResourceType,
  resourceId?: string
): Promise<boolean> {
  const permissionRequest = {
    userId: user.id,
    permission: action,
    ...(resourceType && { resourceType }),
    ...(resourceId && { resourceId }),
  };

  const result = await PermissionService.checkPermission(user, permissionRequest);
  return result.granted;
}

/**
 * Gets the display name for a user
 */
export function getDisplayName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

/**
 * Gets the status color for UI display
 */
export function getStatusColor(status: UserStatus): string {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'green';
    case UserStatus.INACTIVE:
      return 'gray';
    case UserStatus.PENDING:
      return 'yellow';
    case UserStatus.SUSPENDED:
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * Get all roles assigned to a user
 */
export function getUserRoles(user: User): RoleBinding[] {
  return user.roleBindings.filter(
    (binding) => !binding.expiresAt || new Date(binding.expiresAt) > new Date()
  );
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User, roleId: string): boolean {
  return user.roleBindings.some(
    (binding) =>
      binding.roleId === roleId && (!binding.expiresAt || new Date(binding.expiresAt) > new Date())
  );
}

/**
 * Check if user has any admin role
 */
export function isAdmin(user: User): boolean {
  return (
    hasRole(user, SYSTEM_ROLES.ORGANIZATION_ADMIN.id) || hasRole(user, SYSTEM_ROLES.USER_ADMIN.id)
  );
}

/**
 * Check if user is a system user (has system-level permissions)
 */
export function isSystemUser(user: User): boolean {
  return hasRole(user, SYSTEM_ROLES.ORGANIZATION_ADMIN.id);
}

/**
 * Get user's effective permissions
 */
export async function getUserPermissions(user: User): Promise<string[]> {
  const permissions = await PermissionService.getEffectivePermissions(user);
  return permissions.map((p) => p.name);
}

/**
 * Create a new role binding
 */
export function createRoleBinding(
  request: CreateRoleBindingRequest,
  assignedBy: string
): RoleBinding {
  return {
    id: generateId(),
    roleId: request.roleId,
    roleName: getRoleName(request.roleId),
    ...(request.resourceType && { resourceType: request.resourceType }),
    ...(request.resourceId && { resourceId: request.resourceId }),
    ...(request.conditions && { conditions: request.conditions }),
    ...(request.expiresAt && { expiresAt: request.expiresAt }),
    createdAt: new Date().toISOString(),
    assignedBy,
  };
}

/**
 * Update user role bindings
 */
export function updateUserRoleBindings(
  user: User,
  updates: UpdateRoleBindingRequest[],
  updatedBy: string
): RoleBinding[] {
  let roleBindings = [...user.roleBindings];

  for (const update of updates) {
    switch (update.action) {
      case 'add': {
        const newBinding = createRoleBinding(
          {
            roleId: update.roleId,
            ...(update.resourceType && { resourceType: update.resourceType }),
            ...(update.resourceId && { resourceId: update.resourceId }),
            ...(update.conditions && { conditions: update.conditions }),
            ...(update.expiresAt && { expiresAt: update.expiresAt }),
          },
          updatedBy
        );
        roleBindings.push(newBinding);
        break;
      }

      case 'remove':
        if (update.id) {
          roleBindings = roleBindings.filter((binding) => binding.id !== update.id);
        } else {
          // Remove by role ID if no specific binding ID
          roleBindings = roleBindings.filter(
            (binding) =>
              binding.roleId !== update.roleId ||
              binding.resourceType !== update.resourceType ||
              binding.resourceId !== update.resourceId
          );
        }
        break;

      case 'update':
        if (update.id) {
          const index = roleBindings.findIndex((binding) => binding.id === update.id);
          if (index >= 0) {
            const existingBinding = roleBindings[index];
            if (existingBinding) {
              roleBindings[index] = {
                id: existingBinding.id,
                createdAt: existingBinding.createdAt,
                assignedBy: existingBinding.assignedBy,
                roleId: update.roleId,
                roleName: getRoleName(update.roleId),
                ...(update.resourceType !== undefined && { resourceType: update.resourceType }),
                ...(update.resourceId !== undefined && { resourceId: update.resourceId }),
                ...(update.conditions !== undefined && { conditions: update.conditions }),
                ...(update.expiresAt !== undefined && { expiresAt: update.expiresAt }),
              };
            }
          }
        }
        break;
    }
  }

  return roleBindings;
}

/**
 * Get role name by ID
 */
function getRoleName(roleId: string): string {
  const systemRole = Object.values(SYSTEM_ROLES).find((role) => role.id === roleId);
  return systemRole?.name || roleId;
}

/**
 * Generate a unique ID (in a real app, this would be more sophisticated)
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Private helper to validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use canPerformAction instead
 */
export async function canPerformLegacyAction(
  user: User,
  action: 'CREATE_USER' | 'UPDATE_USER' | 'DELETE_USER' | 'VIEW_USERS'
): Promise<boolean> {
  const permissionMap = {
    CREATE_USER: 'user.create',
    UPDATE_USER: 'user.update',
    DELETE_USER: 'user.delete',
    VIEW_USERS: 'user.read',
  };

  return canPerformAction(user, permissionMap[action]);
}

/**
 * Check if a user can assign a specific role
 */
export async function canAssignRole(
  assigner: User,
  roleId: string,
  targetUser?: User
): Promise<boolean> {
  // System admins can assign any role
  if (isSystemUser(assigner)) {
    return true;
  }

  // User admins can assign non-system roles
  if (hasRole(assigner, SYSTEM_ROLES.USER_ADMIN.id)) {
    return !roleId.includes('organization');
  }

  // Managers can assign roles within their department
  if (hasRole(assigner, SYSTEM_ROLES.USER_MANAGER.id) && targetUser) {
    return (
      assigner.profile?.department === targetUser.profile?.department &&
      (roleId === SYSTEM_ROLES.USER_VIEWER.id || roleId === SYSTEM_ROLES.AUTHENTICATED_USER.id)
    );
  }

  return false;
}

/**
 * Get available roles for a user to assign
 */
export async function getAvailableRoles(user: User): Promise<string[]> {
  const availableRoles: string[] = [];

  if (isSystemUser(user)) {
    availableRoles.push(...Object.values(SYSTEM_ROLES).map((role) => role.id));
  } else if (hasRole(user, SYSTEM_ROLES.USER_ADMIN.id)) {
    availableRoles.push(
      SYSTEM_ROLES.USER_MANAGER.id,
      SYSTEM_ROLES.USER_VIEWER.id,
      SYSTEM_ROLES.PROJECT_OWNER.id,
      SYSTEM_ROLES.PROJECT_EDITOR.id,
      SYSTEM_ROLES.PROJECT_VIEWER.id,
      SYSTEM_ROLES.AUTHENTICATED_USER.id
    );
  } else if (hasRole(user, SYSTEM_ROLES.USER_MANAGER.id)) {
    availableRoles.push(SYSTEM_ROLES.USER_VIEWER.id, SYSTEM_ROLES.AUTHENTICATED_USER.id);
  }

  return availableRoles;
}
