/**
 * User Filters Component
 * Provides filtering controls for the user management dashboard
 */

import { useState, useEffect } from 'react';
import { UserStatus, SYSTEM_ROLES, type UserFilters as UserFiltersType } from '../domain/types';
import styles from './UserManagement.module.css';

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
  loading?: boolean;
}

export function UserFilters({ filters, onFiltersChange, loading }: UserFiltersProps) {
  const [localFilters, setLocalFilters] = useState<UserFiltersType>(filters);

  // Sync with external filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof UserFiltersType, value: string) => {
    const newFilters = {
      ...localFilters,
      [key]: value || undefined,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== undefined && value !== ''
  );

  return (
    <div className={styles['user-filters']}>
      <div className={styles['user-filters-grid']}>
        {/* Search Input */}
        <div>
          <label htmlFor='search' className='block text-sm font-medium text-gray-700 mb-1'>
            Search
          </label>
          <input
            id='search'
            type='text'
            placeholder='Search by name or email...'
            value={localFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            disabled={loading}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
          />
        </div>

        {/* Role Filter */}
        <div>
          <label htmlFor='roleId' className='block text-sm font-medium text-gray-700 mb-1'>
            Role
          </label>
          <select
            id='roleId'
            value={localFilters.roleId || ''}
            onChange={(e) => handleFilterChange('roleId', e.target.value)}
            disabled={loading}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
          >
            <option value=''>All Roles</option>
            {Object.values(SYSTEM_ROLES).map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-1'>
            Status
          </label>
          <select
            id='status'
            value={localFilters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            disabled={loading}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
          >
            <option value=''>All Statuses</option>
            {Object.values(UserStatus).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className='mt-4 flex justify-end'>
          <button
            type='button'
            onClick={handleClearFilters}
            disabled={loading}
            className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
          >
            <svg className='w-4 h-4 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <title>Clear filters</title>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
