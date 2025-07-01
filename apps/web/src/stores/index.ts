import { useAuthStore } from './auth';
import { useProjectStore } from './project';
import type { Project } from './project';

/**
 * Global Store - Centralized access to all Zustand stores
 *
 * Usage example:
 * ```typescript
 * import { Store } from '@/stores';
 *
 * // In components
 * useEffect(() => {
 *   Store.Project.loadProjects();
 *   const currentProject = Store.Project.getCurrentProject();
 * }, []);
 * ```
 */
export const Store = {
  /**
   * Authentication store
   */
  Auth: {
    getState: () => useAuthStore.getState(),
    login: (email: string, password: string) => useAuthStore.getState().login(email, password),
    logout: () => useAuthStore.getState().logout(),
    getUser: () => useAuthStore.getState().user,
    isAuthenticated: () => !!useAuthStore.getState().user,
    isLoading: () => useAuthStore.getState().isLoading,
  },

  /**
   * Project store
   */
  Project: {
    getState: () => useProjectStore.getState(),
    loadProjects: () => useProjectStore.getState().loadProjects(),
    getCurrentProject: () => useProjectStore.getState().getCurrentProject(),
    setCurrentProject: (project: Project | null) =>
      useProjectStore.getState().setCurrentProject(project),
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
      useProjectStore.getState().addProject(project),
    updateProject: (id: string, updates: Partial<Project>) =>
      useProjectStore.getState().updateProject(id, updates),
    removeProject: (id: string) => useProjectStore.getState().removeProject(id),
    clearProjects: () => useProjectStore.getState().clearProjects(),
    getProjects: () => useProjectStore.getState().projects,
    isLoading: () => useProjectStore.getState().isLoading,
    getError: () => useProjectStore.getState().error,
  },
};

/**
 * Hook-based store access for reactive components
 * Use this when you need reactive updates in React components
 */
export const useStore = {
  auth: useAuthStore,
  project: useProjectStore,
};
