/**
 * API Repository for User Management Context
 * Handles all API calls related to user management
 */

import { apiClient } from '@/lib/api/client';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
  UserListResponse,
} from '../domain/types';

export class UserRepository {
  private readonly basePath = '/users';

  /**
   * Fetch all users with optional filters
   */
  async getUsers(filters?: UserFilters, page = 1, limit = 10): Promise<UserListResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

    return apiClient.get<UserListResponse>(url);
  }

  /**
   * Fetch a single user by ID
   */
  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/${id}`);
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    return apiClient.post<User>(this.basePath, userData);
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, updates: UpdateUserRequest): Promise<User> {
    return apiClient.patch<User>(`${this.basePath}/${id}`, updates);
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  /**
   * Batch operations
   */
  async batchUpdateUsers(
    updates: Array<{ id: string; updates: UpdateUserRequest }>
  ): Promise<User[]> {
    return apiClient.post<User[]>(`${this.basePath}/batch`, { updates });
  }

  /**
   * Export users data
   */
  async exportUsers(filters?: UserFilters): Promise<Blob> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `${this.basePath}/export?${queryString}` : `${this.basePath}/export`;

    // Custom fetch for blob response
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}${url}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to export users: ${response.statusText}`);
    }

    return response.blob();
  }
}

// Singleton instance
export const userRepository = new UserRepository();
