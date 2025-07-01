/**
 * Query Keys Factory
 * Centralized place to manage all query keys for consistency and type safety
 */

export const queryKeys = {
  // Auth related queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },

  // Users related queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Posts/Content related queries
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },

  // Settings related queries
  settings: {
    all: ['settings'] as const,
    user: () => [...queryKeys.settings.all, 'user'] as const,
    app: () => [...queryKeys.settings.all, 'app'] as const,
  },

  // Notifications related queries
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.notifications.lists(), { filters }] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },
} as const;

/**
 * Helper function to invalidate related queries
 */
export const invalidationMap = {
  // When user data changes, invalidate auth queries
  user: [queryKeys.auth.all, queryKeys.users.all],
  // When posts change, invalidate posts and related user data
  posts: [queryKeys.posts.all],
  // When settings change, invalidate settings queries
  settings: [queryKeys.settings.all],
  // When notifications change, invalidate notification queries
  notifications: [queryKeys.notifications.all],
} as const;
