import { useEffect } from 'react';
import { Store, useStore } from '@/stores';

/**
 * Example component showing how to use the global Store
 * Both non-reactive (Store) and reactive (useStore) approaches
 */
export function ProjectExample() {
  // Method 1: Using global Store (non-reactive, for side effects)
  useEffect(() => {
    // Load projects when component mounts
    Store.Project.loadProjects();

    // Get current project (non-reactive)
    const currentProject = Store.Project.getCurrentProject();
    console.log('Current project:', currentProject);
  }, []);

  // Method 2: Using reactive hooks for UI updates
  const projects = useStore.project((state) => state.projects);
  const currentProject = useStore.project((state) => state.currentProject);
  const isLoading = useStore.project((state) => state.isLoading);
  const error = useStore.project((state) => state.error);

  // Example handlers using global Store
  const handleSetCurrentProject = (projectId: string) => {
    const project = Store.Project.getProjects().find((p) => p.id === projectId);
    if (project) {
      Store.Project.setCurrentProject(project);
    }
  };

  const handleAddProject = () => {
    Store.Project.addProject({
      name: 'New Project',
      description: 'A new project created from the UI',
      status: 'active',
    });
  };

  const handleUpdateProject = (projectId: string) => {
    Store.Project.updateProject(projectId, {
      name: 'Updated Project Name',
      description: 'Updated description',
    });
  };

  const handleRemoveProject = (projectId: string) => {
    Store.Project.removeProject(projectId);
  };

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='animate-pulse'>Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className='text-red-600'>Error: {error}</div>
        <button
          type='button'
          onClick={() => Store.Project.loadProjects()}
          className='mt-2 px-4 py-2 bg-blue-500 text-white rounded'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Project Management</h1>
        <button
          type='button'
          onClick={handleAddProject}
          className='px-4 py-2 bg-green-500 text-white rounded'
        >
          Add Project
        </button>
      </div>

      {/* Current Project */}
      {currentProject && (
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h2 className='text-lg font-semibold text-blue-900'>Current Project</h2>
          <p className='text-blue-700'>{currentProject.name}</p>
          {currentProject.description && (
            <p className='text-sm text-blue-600'>{currentProject.description}</p>
          )}
        </div>
      )}

      {/* Project List */}
      <div className='grid gap-4'>
        <h2 className='text-xl font-semibold'>All Projects</h2>
        {projects.length === 0 ? (
          <p className='text-gray-500'>No projects found</p>
        ) : (
          <div className='space-y-3'>
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 border rounded-lg ${
                  currentProject?.id === project.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>{project.name}</h3>
                    {project.description && (
                      <p className='text-sm text-gray-600'>{project.description}</p>
                    )}
                    <div className='flex items-center gap-2 mt-1'>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          project.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'inactive'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => handleSetCurrentProject(project.id)}
                      disabled={currentProject?.id === project.id}
                      className='px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50'
                    >
                      {currentProject?.id === project.id ? 'Current' : 'Select'}
                    </button>
                    <button
                      type='button'
                      onClick={() => handleUpdateProject(project.id)}
                      className='px-3 py-1 text-sm bg-yellow-500 text-white rounded'
                    >
                      Update
                    </button>
                    <button
                      type='button'
                      onClick={() => handleRemoveProject(project.id)}
                      className='px-3 py-1 text-sm bg-red-500 text-white rounded'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Store State Debug */}
      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='font-medium mb-2'>Store State (Debug)</h3>
        <div className='text-sm space-y-1'>
          <p>Total Projects: {projects.length}</p>
          <p>Current Project ID: {currentProject?.id || 'None'}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
        </div>
      </div>
    </div>
  );
}
