import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProjectActions {
  // Load projects from API or localStorage
  loadProjects: () => Promise<void>;

  // Get current project
  getCurrentProject: () => Project | null;

  // Set current project
  setCurrentProject: (project: Project | null) => void;

  // Add new project
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;

  // Update existing project
  updateProject: (id: string, updates: Partial<Project>) => void;

  // Remove project
  removeProject: (id: string) => void;

  // Clear all projects
  clearProjects: () => void;

  // Set loading state
  setLoading: (loading: boolean) => void;

  // Set error state
  setError: (error: string | null) => void;
}

type ProjectStore = ProjectState & ProjectActions;

// Create the project store
export const useProjectStore = create<ProjectStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        projects: [],
        currentProject: null,
        isLoading: false,
        error: null,

        // Actions
        loadProjects: async () => {
          set({ isLoading: true, error: null });

          try {
            // Simulate API call - replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock data - replace with actual API response
            const mockProjects: Project[] = [
              {
                id: '1',
                name: 'Cosmo View',
                description: 'Main frontend application',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: '2',
                name: 'Component Library',
                description: 'Shared UI components',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ];

            set({
              projects: mockProjects,
              isLoading: false,
              // Set first project as current if none selected
              currentProject: get().currentProject || mockProjects[0] || null,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load projects',
              isLoading: false,
            });
          }
        },

        getCurrentProject: () => {
          return get().currentProject;
        },

        setCurrentProject: (project) => {
          set({ currentProject: project });
        },

        addProject: (projectData) => {
          const newProject: Project = {
            ...projectData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            projects: [...state.projects, newProject],
          }));
        },

        updateProject: (id, updates) => {
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id
                ? { ...project, ...updates, updatedAt: new Date().toISOString() }
                : project
            ),
            // Update current project if it's the one being updated
            currentProject:
              state.currentProject?.id === id
                ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() }
                : state.currentProject,
          }));
        },

        removeProject: (id) => {
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
            // Clear current project if it's the one being removed
            currentProject: state.currentProject?.id === id ? null : state.currentProject,
          }));
        },

        clearProjects: () => {
          set({ projects: [], currentProject: null });
        },

        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        setError: (error) => {
          set({ error });
        },
      }),
      {
        name: 'project-storage',
        // Only persist certain fields
        partialize: (state) => ({
          projects: state.projects,
          currentProject: state.currentProject,
        }),
      }
    ),
    {
      name: 'project-store',
    }
  )
);
