/**
 * User Management Context Index
 * Main export file for the User Management bounded context
 */

// Domain exports
export * from './domain/types';
export * from './domain/services';
export * from './domain/store';

// Infrastructure exports
export { userRepository } from './infrastructure/repository';
export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useBatchUpdateUsers,
  useExportUsers,
  USER_QUERY_KEYS,
} from './infrastructure/hooks';

// Component exports
export { UserCard } from './components/UserCard';
export { UserFilters } from './components/UserFilters';
export { UserModal } from './components/UserModal';
export { UserManagementDashboard } from './components/UserManagementDashboard';
