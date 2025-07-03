/**
 * Domain Types for User Management Context
 * This file contains all the domain-specific types, interfaces, and value objects
 * Inspired by Google Cloud IAM for comprehensive role and permission management
 */

// Core User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
  // Role bindings instead of single role
  roleBindings: RoleBinding[];
  // Direct permissions for exceptional cases
  directPermissions?: Permission[];
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  department?: string;
  phoneNumber?: string;
  location?: string;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

// Permission and Resource System
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: ResourceType;
  action: ActionType;
  // Conditions for context-based permissions
  conditions?: PermissionCondition[];
}

export enum ResourceType {
  USER = 'user',
  PROJECT = 'project',
  DOCUMENT = 'document',
  ORGANIZATION = 'organization',
  ROLE = 'role',
  PERMISSION = 'permission',
  BILLING = 'billing',
  AUDIT = 'audit',
}

export enum ActionType {
  // CRUD operations
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  // Management operations
  MANAGE = 'manage',
  ADMIN = 'admin',
  // Specific operations
  INVITE = 'invite',
  ASSIGN_ROLE = 'assign_role',
  REVOKE_ROLE = 'revoke_role',
  VIEW_AUDIT = 'view_audit',
  EXPORT = 'export',
  ARCHIVE = 'archive',
  RESTORE = 'restore',
}

export interface PermissionCondition {
  type: 'resource_owner' | 'department_member' | 'organization_member' | 'time_based' | 'ip_based';
  value?: string;
  operator?: 'equals' | 'contains' | 'in' | 'not_in';
}

// Role System
export interface Role {
  id: string;
  name: string;
  description: string;
  type: RoleType;
  permissions: Permission[];
  // Inheritance for role hierarchy
  inheritsFrom?: string[];
  // Organization scope
  organizationId?: string;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export enum RoleType {
  SYSTEM = 'system',
  PREDEFINED = 'predefined',
  CUSTOM = 'custom',
}

// Role Binding (User-Role Assignment)
export interface RoleBinding {
  id: string;
  roleId: string;
  roleName: string;
  // Resource scope - if null, applies globally
  resourceType?: ResourceType;
  resourceId?: string;
  // Conditions for the binding
  conditions?: BindingCondition[];
  // Time-based bindings
  expiresAt?: string;
  createdAt: string;
  assignedBy: string;
}

export interface BindingCondition {
  type: 'time_based' | 'approval_required' | 'mfa_required';
  value?: string;
}

// Policy Structure (Google Cloud IAM inspired)
export interface Policy {
  version: string;
  bindings: PolicyBinding[];
  auditConfigs?: AuditConfig[];
}

export interface PolicyBinding {
  role: string;
  members: string[];
  condition?: PolicyCondition;
}

export interface PolicyCondition {
  title?: string;
  description?: string;
  expression: string; // CEL expression
}

export interface AuditConfig {
  service: string;
  auditLogConfigs: AuditLogConfig[];
}

export interface AuditLogConfig {
  logType: 'ADMIN_READ' | 'DATA_READ' | 'DATA_WRITE';
  exemptedMembers?: string[];
}

// Request/Response Types
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  roleBindings: CreateRoleBindingRequest[];
  profile?: Partial<UserProfile>;
}

export interface CreateRoleBindingRequest {
  roleId: string;
  resourceType?: ResourceType;
  resourceId?: string;
  conditions?: BindingCondition[];
  expiresAt?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
  profile?: Partial<UserProfile>;
  roleBindings?: UpdateRoleBindingRequest[];
}

export interface UpdateRoleBindingRequest {
  id?: string; // For updating existing binding
  roleId: string;
  resourceType?: ResourceType;
  resourceId?: string;
  conditions?: BindingCondition[];
  expiresAt?: string;
  action: 'add' | 'remove' | 'update';
}

export interface UserFiltersType {
  roleId?: string;
  status?: UserStatus;
  search?: string;
  department?: string;
  hasPermission?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// Predefined System Roles (Google Cloud inspired)
export const SYSTEM_ROLES = {
  // Organization level roles
  ORGANIZATION_ADMIN: {
    id: 'roles/organization.admin',
    name: 'Organization Administrator',
    description: 'Full access to organization and all resources',
    type: RoleType.SYSTEM,
  },
  ORGANIZATION_VIEWER: {
    id: 'roles/organization.viewer',
    name: 'Organization Viewer',
    description: 'View access to organization resources',
    type: RoleType.SYSTEM,
  },

  // User management roles
  USER_ADMIN: {
    id: 'roles/user.admin',
    name: 'User Administrator',
    description: 'Full access to user management',
    type: RoleType.SYSTEM,
  },
  USER_MANAGER: {
    id: 'roles/user.manager',
    name: 'User Manager',
    description: 'Manage users within department',
    type: RoleType.SYSTEM,
  },
  USER_VIEWER: {
    id: 'roles/user.viewer',
    name: 'User Viewer',
    description: 'View user information',
    type: RoleType.SYSTEM,
  },

  // Project roles
  PROJECT_OWNER: {
    id: 'roles/project.owner',
    name: 'Project Owner',
    description: 'Full access to project resources',
    type: RoleType.SYSTEM,
  },
  PROJECT_EDITOR: {
    id: 'roles/project.editor',
    name: 'Project Editor',
    description: 'Edit access to project resources',
    type: RoleType.SYSTEM,
  },
  PROJECT_VIEWER: {
    id: 'roles/project.viewer',
    name: 'Project Viewer',
    description: 'View access to project resources',
    type: RoleType.SYSTEM,
  },

  // Basic roles
  AUTHENTICATED_USER: {
    id: 'roles/authenticated.user',
    name: 'Authenticated User',
    description: 'Basic authenticated user permissions',
    type: RoleType.SYSTEM,
  },
} as const;

// Permission checking utility types
export interface PermissionContext {
  resourceOwnerId?: string;
  department?: string;
  organizationId?: string;
  ip?: string;
  time?: string;
}

export interface PermissionCheckRequest {
  userId: string;
  permission: string;
  resourceType?: ResourceType;
  resourceId?: string;
  context?: PermissionContext;
}

export interface PermissionCheckResponse {
  granted: boolean;
  reason?: string;
  conditions?: string[];
}

// Keep the original names as aliases for backwards compatibility
export type UserFilters = UserFiltersType;

// Legacy support - will be deprecated
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

// Domain Events
export interface UserCreatedEvent {
  type: 'USER_CREATED';
  payload: User;
}

export interface UserUpdatedEvent {
  type: 'USER_UPDATED';
  payload: User;
}

export interface UserDeletedEvent {
  type: 'USER_DELETED';
  payload: { id: string };
}

export interface RoleAssignedEvent {
  type: 'ROLE_ASSIGNED';
  payload: {
    userId: string;
    roleBinding: RoleBinding;
  };
}

export interface RoleRevokedEvent {
  type: 'ROLE_REVOKED';
  payload: {
    userId: string;
    roleBindingId: string;
  };
}

export interface PermissionGrantedEvent {
  type: 'PERMISSION_GRANTED';
  payload: {
    userId: string;
    permission: Permission;
  };
}

export interface PermissionRevokedEvent {
  type: 'PERMISSION_REVOKED';
  payload: {
    userId: string;
    permissionId: string;
  };
}

export type UserDomainEvent =
  | UserCreatedEvent
  | UserUpdatedEvent
  | UserDeletedEvent
  | RoleAssignedEvent
  | RoleRevokedEvent
  | PermissionGrantedEvent
  | PermissionRevokedEvent;
