/**
 * User Card Component
 * Displays individual user information with domain-specific styling
 */

import { useState, useEffect } from 'react';
import type { User } from '../domain/types';
import { UserStatus } from '../domain/types';
import { getDisplayName, canPerformAction } from '../domain/services';
import { useDeleteUser, useUpdateUser } from '../infrastructure/hooks';
import { useUserManagementStore } from '../domain/store';
import styles from './UserManagement.module.css';

interface UserCardProps {
  user: User;
  currentUser: User;
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
}

export function UserCard({ user, currentUser, onEdit, onView }: UserCardProps) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const { setSelectedUser } = useUserManagementStore();

  // Check permissions asynchronously
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const [editPermission, deletePermission] = await Promise.all([
          canPerformAction(currentUser, 'user.update'),
          canPerformAction(currentUser, 'user.delete'),
        ]);
        setCanEdit(editPermission);
        setCanDelete(deletePermission);
      } catch (error) {
        console.error('Failed to check permissions:', error);
        setCanEdit(false);
        setCanDelete(false);
      }
    };

    checkPermissions();
  }, [currentUser]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${getDisplayName(user)}?`)) {
      try {
        await deleteUser.mutateAsync(user.id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    try {
      await updateUser.mutateAsync({
        id: user.id,
        updates: { status: newStatus },
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleView = () => {
    setSelectedUser(user);
    onView?.(user);
  };

  const handleEdit = () => {
    setSelectedUser(user);
    onEdit?.(user);
  };

  const getRoleClassName = (role: string) => {
    if (role.includes('admin')) {
      return styles['user-role-admin'];
    } else if (role.includes('manager') || role.includes('owner')) {
      return styles['user-role-moderator'];
    } else {
      return styles['user-role-user'];
    }
  };

  const getStatusClassName = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return styles['user-status-active'];
      case UserStatus.INACTIVE:
        return styles['user-status-inactive'];
      case UserStatus.PENDING:
        return styles['user-status-pending'];
      case UserStatus.SUSPENDED:
        return styles['user-status-suspended'];
      default:
        return styles['user-status-inactive'];
    }
  };

  const getUserInitials = (user: User) => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <div className={styles['user-card']}>
      <div className={styles['user-card-header']}>
        <div className={styles['user-avatar']}>
          {user.profile?.avatar ? (
            <img
              src={user.profile.avatar}
              alt={getDisplayName(user)}
              className='w-full h-full object-cover rounded-full'
            />
          ) : (
            <span>{getUserInitials(user)}</span>
          )}
        </div>

        <div className={styles['user-info']}>
          <h3 className={styles['user-name']}>{getDisplayName(user)}</h3>
          <p className={styles['user-email']}>{user.email}</p>

          <div className='flex items-center gap-2 mt-2'>
            <span
              className={`${styles['user-role']} ${getRoleClassName(getUserPrimaryRole(user))}`}
            >
              {getUserPrimaryRole(user)}
            </span>
            <span className={`${styles['user-status']} ${getStatusClassName(user.status)}`}>
              {user.status}
            </span>
          </div>
        </div>

        <div className='relative'>
          <button
            type='button'
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className='text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100'
          >
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <title>More options</title>
              <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
            </svg>
          </button>

          {isActionsOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border'>
              <div className='py-1'>
                <button
                  type='button'
                  onClick={handleView}
                  className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                >
                  View Details
                </button>

                {canEdit && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Edit User
                    </button>

                    <button
                      type='button'
                      onClick={handleStatusToggle}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      disabled={updateUser.isPending}
                    >
                      {user.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                    </button>
                  </>
                )}

                {canDelete && user.id !== currentUser.id && (
                  <button
                    type='button'
                    onClick={handleDelete}
                    className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                    disabled={deleteUser.isPending}
                  >
                    Delete User
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {user.profile?.bio && (
        <div className='mt-4'>
          <p className='text-sm text-gray-600 line-clamp-2'>{user.profile.bio}</p>
        </div>
      )}

      <div className='mt-4 flex items-center justify-between text-xs text-gray-500'>
        <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

/**
 * Helper function to get user's primary role for display
 */
function getUserPrimaryRole(user: User): string {
  const roles = user.roleBindings.filter(
    (binding) => !binding.expiresAt || new Date(binding.expiresAt) > new Date()
  );

  if (roles.length === 0) return 'No Role';

  // Priority order for display (most important first)
  const rolePriority = [
    'roles/organization.admin',
    'roles/user.admin',
    'roles/user.manager',
    'roles/project.owner',
    'roles/project.editor',
    'roles/user.viewer',
    'roles/project.viewer',
    'roles/authenticated.user',
  ];

  for (const priorityRole of rolePriority) {
    const found = roles.find((role) => role.roleId === priorityRole);
    if (found) {
      return found.roleName || found.roleId.replace('roles/', '');
    }
  }

  // Return first role if no priority match
  if (roles.length > 0) {
    const firstRole = roles[0];
    if (firstRole) {
      return firstRole.roleName || firstRole.roleId.replace('roles/', '');
    }
  }

  return 'No Role';
}
