/**
 * React Query Hooks for User Management Context
 * Integrates API calls with React Query for caching and state management
 */

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userRepository } from './repository';
import { useUserManagementStore } from '../domain/store';
import { validateUserCreation, validateUserUpdate } from '../domain/services';
import type { CreateUserRequest, UpdateUserRequest, UserFilters } from '../domain/types';

// Query Keys
export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: UserFilters) => [...USER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
  export: (filters?: UserFilters) => [...USER_QUERY_KEYS.all, 'export', filters] as const,
} as const;

/**
 * Hook to fetch users with filters
 */
export function useUsers(filters?: UserFilters, page = 1, limit = 10) {
  const { setUsers, setLoading, setError } = useUserManagementStore();

  const query = useQuery({
    queryKey: USER_QUERY_KEYS.list(filters),
    queryFn: () => userRepository.getUsers(filters, page, limit),
  });

  // Handle side effects
  useEffect(() => {
    if (query.data) {
      setUsers(query.data.users);
      setLoading(false);
      setError(null);
    }
  }, [query.data, setUsers, setLoading, setError]);

  useEffect(() => {
    if (query.error) {
      setLoading(false);
      setError(query.error instanceof Error ? query.error.message : 'Failed to fetch users');
    }
  }, [query.error, setLoading, setError]);

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return query;
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: string) {
  const { setSelectedUser, setLoading, setError } = useUserManagementStore();

  const query = useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => userRepository.getUserById(id),
    enabled: !!id,
  });

  // Handle side effects
  useEffect(() => {
    if (query.data) {
      setSelectedUser(query.data);
      setLoading(false);
      setError(null);
    }
  }, [query.data, setSelectedUser, setLoading, setError]);

  useEffect(() => {
    if (query.error) {
      setLoading(false);
      setError(query.error instanceof Error ? query.error.message : 'Failed to fetch user');
    }
  }, [query.error, setLoading, setError]);

  return query;
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { addUser, emitDomainEvent } = useUserManagementStore();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => {
      // Validate using domain service
      const validation = validateUserCreation(userData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      return userRepository.createUser(userData);
    },
    onSuccess: (newUser) => {
      // Update local state
      addUser(newUser);

      // Emit domain event
      emitDomainEvent({
        type: 'USER_CREATED',
        payload: newUser,
      });

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { updateUser, getUserById, emitDomainEvent } = useUserManagementStore();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateUserRequest }) => {
      // Validate using domain service
      const currentUser = getUserById(id);
      if (!currentUser) {
        throw new Error('User not found');
      }

      const validation = validateUserUpdate(currentUser, updates);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      return userRepository.updateUser(id, updates);
    },
    onSuccess: (updatedUser) => {
      // Update local state
      updateUser(updatedUser.id, updatedUser);

      // Emit domain event
      emitDomainEvent({
        type: 'USER_UPDATED',
        payload: updatedUser,
      });

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(updatedUser.id) });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { removeUser, emitDomainEvent } = useUserManagementStore();

  return useMutation({
    mutationFn: (id: string) => userRepository.deleteUser(id),
    onSuccess: (_, id) => {
      // Update local state
      removeUser(id);

      // Emit domain event
      emitDomainEvent({
        type: 'USER_DELETED',
        payload: { id },
      });

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.detail(id) });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
}

/**
 * Hook to batch update users
 */
export function useBatchUpdateUsers() {
  const queryClient = useQueryClient();
  const { updateUser } = useUserManagementStore();

  return useMutation({
    mutationFn: (updates: Array<{ id: string; updates: UpdateUserRequest }>) =>
      userRepository.batchUpdateUsers(updates),
    onSuccess: (updatedUsers) => {
      // Update local state for each user
      for (const user of updatedUsers) {
        updateUser(user.id, user);
      }

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      console.error('Failed to batch update users:', error);
    },
  });
}

/**
 * Hook to export users
 */
export function useExportUsers() {
  return useMutation({
    mutationFn: (filters?: UserFilters) => userRepository.exportUsers(filters),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: (error) => {
      console.error('Failed to export users:', error);
    },
  });
}
