import {
  type CreatePostData,
  type UpdatePostData,
  useCreatePost,
  useCurrentUser,
  useDeletePost,
  useLogin,
  useLogout,
  usePosts,
  useUpdatePost,
} from '@/lib/api/hooks';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';

/**
 * Example component showing how to use the API hooks
 */
export function ExampleApiUsage() {
  // Error handling
  const { handleError } = useErrorHandler({
    onUnauthorized: () => {
      console.log('User needs to log in');
      // Redirect to login or show login modal
    },
    onNetworkError: () => {
      console.log('Network error - check connection');
      // Show network error banner
    },
  });

  // Auth hooks
  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  // Posts hooks
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = usePosts({ status: 'published' });

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  // Handle errors
  if (userError) handleError(userError);
  if (postsError) handleError(postsError);

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({
        email: 'user@example.com',
        password: 'password123',
      });
      console.log('Login successful');
    } catch (error) {
      handleError(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      console.log('Logout successful');
    } catch (error) {
      handleError(error);
    }
  };

  const handleCreatePost = async () => {
    const newPost: CreatePostData = {
      title: 'New Post',
      content: 'This is a new post content',
    };

    try {
      await createPostMutation.mutateAsync(newPost);
      console.log('Post created successfully');
    } catch (error) {
      handleError(error);
    }
  };

  const handleUpdatePost = async (postId: string) => {
    const updateData: UpdatePostData = {
      title: 'Updated Post Title',
    };

    try {
      await updatePostMutation.mutateAsync({ id: postId, data: updateData });
      console.log('Post updated successfully');
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      console.log('Post deleted successfully');
    } catch (error) {
      handleError(error);
    }
  };

  if (userLoading) {
    return <div>Loading user...</div>;
  }

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>API Hooks Example</h1>

      {/* User Section */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>User Management</h2>
        {currentUser ? (
          <div className='space-y-2'>
            <p>Welcome, {currentUser.name}!</p>
            <p>Email: {currentUser.email}</p>
            <button
              type='button'
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className='px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50'
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        ) : (
          <button
            type='button'
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        )}
      </section>

      {/* Posts Section */}
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Posts Management</h2>
          <div className='space-x-2'>
            <button
              type='button'
              onClick={handleCreatePost}
              disabled={createPostMutation.isPending}
              className='px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50'
            >
              {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type='button'
              onClick={() => refetchPosts()}
              className='px-4 py-2 bg-gray-500 text-white rounded'
            >
              Refresh Posts
            </button>
          </div>
        </div>

        {postsLoading ? (
          <div>Loading posts...</div>
        ) : posts ? (
          <div className='space-y-4'>
            {posts.map((post) => (
              <div key={post.id} className='border p-4 rounded space-y-2'>
                <h3 className='font-semibold'>{post.title}</h3>
                <p className='text-gray-600'>{post.content}</p>
                <div className='flex space-x-2'>
                  <button
                    type='button'
                    onClick={() => handleUpdatePost(post.id)}
                    disabled={updatePostMutation.isPending}
                    className='px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50'
                  >
                    {updatePostMutation.isPending ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletePostMutation.isPending}
                    className='px-3 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50'
                  >
                    {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No posts found</div>
        )}
      </section>

      {/* Loading States */}
      <section className='space-y-2'>
        <h2 className='text-xl font-semibold'>Loading States</h2>
        <div className='text-sm text-gray-600 space-y-1'>
          <p>Login mutation: {loginMutation.isPending ? 'Loading' : 'Idle'}</p>
          <p>Logout mutation: {logoutMutation.isPending ? 'Loading' : 'Idle'}</p>
          <p>Create post: {createPostMutation.isPending ? 'Loading' : 'Idle'}</p>
          <p>Update post: {updatePostMutation.isPending ? 'Loading' : 'Idle'}</p>
          <p>Delete post: {deletePostMutation.isPending ? 'Loading' : 'Idle'}</p>
        </div>
      </section>
    </div>
  );
}
