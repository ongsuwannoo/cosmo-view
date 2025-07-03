/**
 * User Management Dashboard Component
 * Main component that orchestrates the user management domain
 */

import { useEffect, useState } from 'react';
import { UserCard } from './UserCard';
import { UserFilters } from './UserFilters';
import { UserModal } from './UserModal';
import { useUsers, useExportUsers } from '../infrastructure/hooks';
import {
  useUserManagementStore,
  useFilteredUsers,
  useUserLoading,
  useUserError,
} from '../domain/store';
import { UserStatus, SYSTEM_ROLES, type User } from '../domain/types';
import { canPerformAction } from '../domain/services';
import styles from './UserManagement.module.css';

// Mock current user for demonstration
const CURRENT_USER: User = {
  id: 'current-user',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  roleBindings: [
    {
      id: 'admin-binding',
      roleId: SYSTEM_ROLES.ORGANIZATION_ADMIN.id,
      roleName: SYSTEM_ROLES.ORGANIZATION_ADMIN.name,
      createdAt: new Date().toISOString(),
      assignedBy: 'system',
    },
  ],
  status: UserStatus.ACTIVE,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function UserManagementDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [canCreate, setCanCreate] = useState(false);
  const [canView, setCanView] = useState(false);

  // Domain state
  const { filters, setFilters } = useUserManagementStore();
  const filteredUsers = useFilteredUsers();
  const loading = useUserLoading();
  const error = useUserError();

  // API hooks
  const { data: usersData, refetch } = useUsers(filters, currentPage, pageSize);
  const exportUsers = useExportUsers();

  // Check permissions asynchronously
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const [createPermission, viewPermission] = await Promise.all([
          canPerformAction(CURRENT_USER, 'user.create'),
          canPerformAction(CURRENT_USER, 'user.read'),
        ]);
        setCanCreate(createPermission);
        setCanView(viewPermission);
      } catch (error) {
        console.error('Failed to check permissions:', error);
        setCanCreate(false);
        setCanView(false);
      }
    };

    checkPermissions();
  }, []);

  // Handlers
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleViewUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleExportUsers = async () => {
    try {
      await exportUsers.mutateAsync(filters);
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  if (!canView) {
    return (
      <div className={styles['user-management-container']}>
        <div className={styles['user-error']}>
          <div className={styles['user-error-content']}>
            <svg
              className={styles['user-error-icon']}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <span className={styles['user-error-message']}>
              You don't have permission to view users.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['user-management-container']}>
      {/* Header */}
      <div className={styles['user-management-header']}>
        <h1 className={styles['user-management-title']}>User Management</h1>
        <div className={styles['user-management-actions']}>
          <button
            type='button'
            onClick={handleRefresh}
            className={`${styles['user-action-button']} ${styles['user-action-button-secondary']}`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>

          <button
            type='button'
            onClick={handleExportUsers}
            className={`${styles['user-action-button']} ${styles['user-action-button-secondary']}`}
            disabled={exportUsers.isPending}
          >
            {exportUsers.isPending ? 'Exporting...' : 'Export'}
          </button>

          {canCreate && (
            <button
              type='button'
              onClick={handleCreateUser}
              className={`${styles['user-action-button']} ${styles['user-action-button-primary']}`}
            >
              Create User
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles['user-error']}>
          <div className={styles['user-error-content']}>
            <svg
              className={styles['user-error-icon']}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span className={styles['user-error-message']}>{error}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <UserFilters filters={filters} onFiltersChange={setFilters} loading={loading} />

      {/* Users Grid */}
      {loading ? (
        <div className={styles['user-loading']}>
          <div className={styles['user-loading-spinner']} />
          <p className='ml-3 text-gray-600'>Loading users...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <>
          <div className={styles['user-grid']}>
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                currentUser={CURRENT_USER}
                onEdit={handleEditUser}
                onView={handleViewUser}
              />
            ))}
          </div>

          {/* Pagination */}
          {usersData && usersData.total > pageSize && (
            <div className='flex justify-center mt-8'>
              <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'>
                <button
                  type='button'
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50'
                >
                  Previous
                </button>

                {Array.from({ length: Math.ceil(usersData.total / pageSize) }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type='button'
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type='button'
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(usersData.total / pageSize)}
                  className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50'
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className={styles['user-empty-state']}>
          <svg
            className={styles['user-empty-state-icon']}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
            />
          </svg>
          <h3 className={styles['user-empty-state-title']}>No users found</h3>
          <p className={styles['user-empty-state-description']}>
            {filters.search || filters.roleId || filters.status
              ? 'Try adjusting your filters to find users.'
              : 'Get started by creating your first user.'}
          </p>
          {canCreate && (
            <button
              type='button'
              onClick={handleCreateUser}
              className={`${styles['user-action-button']} ${styles['user-action-button-primary']}`}
            >
              Create User
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          isOpen={showModal}
          onClose={handleCloseModal}
          currentUser={CURRENT_USER}
        />
      )}
    </div>
  );
}
