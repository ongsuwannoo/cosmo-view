/**
 * State Management for User Management Context
 * Uses Zustand for state management with domain-specific logic
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User, UserFilters, UserDomainEvent } from './types';

export interface UserManagementState {
  // State
  users: User[];
  selectedUser: User | null;
  filters: UserFilters;
  loading: boolean;
  error: string | null;

  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
  setSelectedUser: (user: User | null) => void;
  setFilters: (filters: UserFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed/Derived State
  getFilteredUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  getUsersCount: () => number;

  // Domain Events
  emitDomainEvent: (event: UserDomainEvent) => void;
}

export const useUserManagementStore = create<UserManagementState>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial State
        users: [],
        selectedUser: null,
        filters: {},
        loading: false,
        error: null,

        // Actions
        setUsers: (users) =>
          set((state) => {
            state.users = users;
          }),

        addUser: (user) =>
          set((state) => {
            state.users.push(user);
            state.error = null;
          }),

        updateUser: (id, updates) =>
          set((state) => {
            const index = state.users.findIndex((u: User) => u.id === id);
            if (index >= 0 && state.users[index]) {
              Object.assign(state.users[index] as object, updates);
            }
          }),

        removeUser: (id) =>
          set((state) => {
            state.users = state.users.filter((u: User) => u.id !== id);
            if (state.selectedUser?.id === id) {
              state.selectedUser = null;
            }
          }),

        setSelectedUser: (user) =>
          set((state) => {
            state.selectedUser = user;
          }),

        setFilters: (filters) =>
          set((state) => {
            state.filters = filters;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.loading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        // Computed State
        getFilteredUsers: () => {
          const state = get();
          const { users, filters } = state;

          return users.filter((user) => {
            if (filters.roleId) {
              const hasRole = user.roleBindings.some(
                (binding) =>
                  binding.roleId === filters.roleId &&
                  (!binding.expiresAt || new Date(binding.expiresAt) > new Date())
              );
              if (!hasRole) return false;
            }
            if (filters.status && user.status !== filters.status) return false;
            if (filters.search) {
              const searchLower = filters.search.toLowerCase();
              const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
              return (
                fullName.includes(searchLower) || user.email.toLowerCase().includes(searchLower)
              );
            }
            return true;
          });
        },

        getUserById: (id) => {
          const state = get();
          return state.users.find((user) => user.id === id);
        },

        getUsersCount: () => {
          const state = get();
          return state.users.length;
        },

        // Domain Events
        emitDomainEvent: (event) => {
          // This could be enhanced to integrate with a proper event bus
          console.log('Domain Event:', event);

          // Handle side effects based on domain events
          switch (event.type) {
            case 'USER_CREATED':
              get().addUser(event.payload);
              break;
            case 'USER_UPDATED':
              get().updateUser(event.payload.id, event.payload);
              break;
            case 'USER_DELETED':
              get().removeUser(event.payload.id);
              break;
          }
        },
      }))
    ),
    {
      name: 'user-management-store',
    }
  )
);

// Selector hooks for specific state slices
export const useUserManagementUsers = () => useUserManagementStore((state) => state.users);
export const useSelectedUser = () => useUserManagementStore((state) => state.selectedUser);
export const useUserFilters = () => useUserManagementStore((state) => state.filters);
export const useUserLoading = () => useUserManagementStore((state) => state.loading);
export const useUserError = () => useUserManagementStore((state) => state.error);
export const useFilteredUsers = () => useUserManagementStore((state) => state.getFilteredUsers());

// Subscribe to domain events
useUserManagementStore.subscribe(
  (state) => state.users,
  (users, prevUsers) => {
    // Log user changes for debugging
    if (users.length !== prevUsers.length) {
      console.log(`User count changed: ${prevUsers.length} → ${users.length}`);
    }
  }
);
