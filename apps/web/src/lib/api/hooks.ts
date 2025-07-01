import { apiClient } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { localStorage } from '@/lib/hooks/useLocalStorage';

// Types for our API responses
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

/**
 * Auth Hooks
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiClient.post<AuthResponse>('/auth/login', credentials),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('auth_token', data.token);
      // Update user query cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSuccess: () => {
      // Clear token
      localStorage.removeItem('auth_token');
      // Clear all cached data
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => apiClient.get<User>('/auth/me'),
    enabled: !!localStorage.getItem('auth_token'),
  });
}

/**
 * User Hooks
 */
export function useUsers(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () =>
      apiClient.get<User[]>('/users', {
        // Convert filters to URLSearchParams
        ...(Object.keys(filters).length > 0 && {
          headers: { 'X-Filters': JSON.stringify(filters) },
        }),
      }),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => apiClient.get<User>(`/users/${id}`),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      apiClient.patch<User>(`/users/${id}`, data),
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(queryKeys.users.detail(updatedUser.id), updatedUser);
      // If it's the current user, update auth cache too
      const currentUser = queryClient.getQueryData(queryKeys.auth.user()) as User | undefined;
      if (currentUser?.id === updatedUser.id) {
        queryClient.setQueryData(queryKeys.auth.user(), updatedUser);
      }
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

/**
 * Posts Hooks
 */
export function usePosts(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: queryKeys.posts.list(filters),
    queryFn: () =>
      apiClient.get<Post[]>('/posts', {
        ...(Object.keys(filters).length > 0 && {
          headers: { 'X-Filters': JSON.stringify(filters) },
        }),
      }),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => apiClient.get<Post>(`/posts/${id}`),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => apiClient.post<Post>('/posts', data),
    onSuccess: () => {
      // Invalidate posts list to refetch with new post
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostData }) =>
      apiClient.patch<Post>(`/posts/${id}`, data),
    onSuccess: (updatedPost) => {
      // Update the specific post in cache
      queryClient.setQueryData(queryKeys.posts.detail(updatedPost.id), updatedPost);
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/posts/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(deletedId) });
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
  });
}
