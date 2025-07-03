/**
 * User Modal Component
 * Modal for creating and editing users
 */

import { useState, useEffect } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest } from '../domain/types';
import { UserStatus, SYSTEM_ROLES } from '../domain/types';
import { useCreateUser, useUpdateUser } from '../infrastructure/hooks';
import { validateUserCreation, validateUserUpdate } from '../domain/services';

interface UserModalProps {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export function UserModal({ user, isOpen, onClose }: UserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    roleId: SYSTEM_ROLES.AUTHENTICATED_USER.id as string,
    status: UserStatus.ACTIVE,
    bio: '',
    department: '',
    phoneNumber: '',
    location: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isEditing = !!user;
  const modalTitle = isEditing ? `Edit ${user.firstName} ${user.lastName}` : 'Create New User';

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Get the primary role for editing
        const primaryRole = user.roleBindings?.[0]?.roleId || SYSTEM_ROLES.AUTHENTICATED_USER.id;
        setFormData({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: primaryRole,
          status: user.status,
          bio: user.profile?.bio || '',
          department: user.profile?.department || '',
          phoneNumber: user.profile?.phoneNumber || '',
          location: user.profile?.location || '',
        });
      } else {
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          roleId: SYSTEM_ROLES.AUTHENTICATED_USER.id,
          status: UserStatus.ACTIVE,
          bio: '',
          department: '',
          phoneNumber: '',
          location: '',
        });
      }
      setErrors([]);
    }
  }, [isOpen, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      if (isEditing && user) {
        // Update existing user
        const updates: UpdateUserRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          status: formData.status,
          profile: {
            ...(formData.bio && { bio: formData.bio }),
            ...(formData.department && { department: formData.department }),
            ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
            ...(formData.location && { location: formData.location }),
          },
          // Handle role changes as role binding updates
          roleBindings: user.roleBindings?.[0]?.id
            ? [
                {
                  action: 'update' as const,
                  roleId: formData.roleId,
                  id: user.roleBindings[0].id,
                },
              ]
            : [
                {
                  action: 'add' as const,
                  roleId: formData.roleId,
                },
              ],
        };

        const validation = validateUserUpdate(user, updates);
        if (!validation.isValid) {
          setErrors(validation.errors);
          return;
        }

        await updateUser.mutateAsync({ id: user.id, updates });
      } else {
        // Create new user
        const userData: CreateUserRequest = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          roleBindings: [
            {
              roleId: formData.roleId,
            },
          ],
          profile: {
            ...(formData.bio && { bio: formData.bio }),
            ...(formData.department && { department: formData.department }),
            ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
            ...(formData.location && { location: formData.location }),
          },
        };

        const validation = validateUserCreation(userData);
        if (!validation.isValid) {
          setErrors(validation.errors);
          return;
        }

        await createUser.mutateAsync(userData);
      }

      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setErrors([message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>{modalTitle}</h2>
            <button
              type='button'
              onClick={handleClose}
              disabled={isSubmitting}
              className='text-gray-400 hover:text-gray-600 disabled:opacity-50'
            >
              <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <title>Close</title>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='px-6 py-4'>
          {/* Error Display */}
          {errors.length > 0 && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
              <div className='flex'>
                <svg className='w-5 h-5 text-red-400 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                  <title>Error</title>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
                <div>
                  {errors.map((error) => (
                    <p key={error} className='text-sm text-red-600'>
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Email (only for new users) */}
            {!isEditing && (
              <div className='md:col-span-2'>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                  Email Address *
                </label>
                <input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isSubmitting}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50'
                  required
                />
              </div>
            )}

            {/* First Name */}
            <div>
              <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-1'>
                First Name *
              </label>
              <input
                id='firstName'
                type='text'
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={isSubmitting}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50'
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-1'>
                Last Name *
              </label>
              <input
                id='lastName'
                type='text'
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={isSubmitting}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50'
                required
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor='roleId' className='block text-sm font-medium text-gray-700 mb-1'>
                Role *
              </label>
              <select
                id='roleId'
                value={formData.roleId}
                onChange={(e) => handleInputChange('roleId', e.target.value)}
                disabled={isSubmitting}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50'
                required
              >
                {Object.values(SYSTEM_ROLES).map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status (only for editing) */}
            {isEditing && (
              <div>
                <label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-1'>
                  Status *
                </label>
                <select
                  id='status'
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={isSubmitting}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50'
                  required
                >
                  {Object.values(UserStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Department */}
            <div>
              <label htmlFor='department' className='block text-sm font-medium text-gray-700 mb-1'>
                Department
              </label>
              <input
                id='department'
                type='text'
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={isSubmitting}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50'
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700 mb-1'>
                Phone Number
              </label>
              <input
                id='phoneNumber'
                type='tel'
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={isSubmitting}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50'
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor='location' className='block text-sm font-medium text-gray-700 mb-1'>
                Location
              </label>
              <input
                id='location'
                type='text'
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={isSubmitting}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50'
              />
            </div>

            {/* Bio */}
            <div className='md:col-span-2'>
              <label htmlFor='bio' className='block text-sm font-medium text-gray-700 mb-1'>
                Bio
              </label>
              <textarea
                id='bio'
                rows={3}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={isSubmitting}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50'
                placeholder='Tell us about this user...'
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className='px-6 py-4 border-t border-gray-200 flex justify-end space-x-3'>
          <button
            type='button'
            onClick={handleClose}
            disabled={isSubmitting}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
