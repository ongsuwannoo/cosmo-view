# TanStack Query Setup

This project includes a comprehensive TanStack Query setup with error handling, type safety, and organized structure for all HTTP methods (GET, POST, PATCH, DELETE).

## Features

-   ✅ Complete TanStack Query configuration with React Query DevTools
-   ✅ Type-safe API client using native fetch
-   ✅ Comprehensive error handling with custom error codes
-   ✅ Automatic retry logic for different error types
-   ✅ Query key factory for organized cache management
-   ✅ Pre-built hooks for common operations (CRUD)
-   ✅ Error handling hooks with automatic logging and callbacks

## Project Structure

```text
src/lib/
├── api/
│   ├── client.ts          # API client with fetch wrapper
│   └── hooks.ts           # React Query hooks for API calls
├── constants/
│   └── error-codes.ts     # Error codes and messages
├── hooks/
│   └── useErrorHandler.ts # Error handling utilities
├── query/
│   ├── provider.tsx       # React Query provider setup
│   └── keys.ts           # Query keys factory
└── index.ts              # Main exports
```

## Setup

### 1. Install Dependencies

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

### 2. Wrap Your App

The `QueryProvider` is already set up in `src/main.tsx`:

```tsx
import { QueryProvider } from "@/lib/query/provider";

createRoot(rootElement).render(
    <StrictMode>
        <QueryProvider>
            <RouterProvider router={router} />
        </QueryProvider>
    </StrictMode>
);
```

### 3. Environment Variables

Create a `.env` file with your API base URL:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Usage Examples

### Basic API Hooks

```tsx
import { useCurrentUser, useLogin, usePosts, useCreatePost } from "@/lib";

function MyComponent() {
    // Query hooks
    const { data: user, isLoading, error } = useCurrentUser();
    const { data: posts } = usePosts({ status: "published" });

    // Mutation hooks
    const loginMutation = useLogin();
    const createPostMutation = useCreatePost();

    const handleLogin = async () => {
        try {
            await loginMutation.mutateAsync({
                email: "user@example.com",
                password: "password123",
            });
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
}
```

### Error Handling

```tsx
import { useErrorHandler } from "@/lib";

function MyComponent() {
    const { handleError } = useErrorHandler({
        onUnauthorized: () => {
            // Redirect to login
            router.navigate("/login");
        },
        onNetworkError: () => {
            // Show network error notification
            showNotification("Network error. Please check your connection.");
        },
    });

    const { data, error } = useCurrentUser();

    if (error) {
        handleError(error);
    }
}
```

### Direct API Client Usage

```tsx
import { apiClient } from "@/lib";

// GET request
const users = await apiClient.get<User[]>("/users");

// POST request
const newUser = await apiClient.post<User>("/users", {
    name: "John Doe",
    email: "john@example.com",
});

// PATCH request
const updatedUser = await apiClient.patch<User>(`/users/${id}`, {
    name: "Jane Doe",
});

// DELETE request
await apiClient.delete(`/users/${id}`);
```

## API Client Features

### Automatic Error Handling

The API client automatically handles common error scenarios:

-   Network errors and timeouts
-   Authentication failures (401/403)
-   Validation errors (400)
-   Server errors (5xx)
-   Rate limiting (429)

### Request Configuration

```tsx
// Custom headers
const data = await apiClient.get("/users", {
    headers: {
        "X-Custom-Header": "value",
    },
});

// Request timeout (default: 30 seconds)
const data = await apiClient.get("/users");
```

### Authentication

The client automatically includes Bearer tokens from localStorage:

```tsx
// Login stores the token automatically
await loginMutation.mutateAsync({ email, password });

// All subsequent requests include the token
const userData = await apiClient.get("/auth/me");

// Logout clears the token
await logoutMutation.mutateAsync();
```

## Query Keys

Use the query keys factory for consistent cache management:

```tsx
import { queryKeys, invalidationMap } from "@/lib";

// Invalidate specific data
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

// Invalidate user detail
queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });

// Use invalidation map for related data
queryClient.invalidateQueries({ queryKey: invalidationMap.user });
```

## Error Codes

Available error codes and their meanings:

-   `NETWORK_ERROR` - Network connection failed
-   `TIMEOUT_ERROR` - Request timed out
-   `UNAUTHORIZED` - Authentication required
-   `FORBIDDEN` - Access denied
-   `VALIDATION_ERROR` - Invalid input data
-   `NOT_FOUND` - Resource not found
-   `RATE_LIMITED` - Too many requests
-   `INTERNAL_SERVER_ERROR` - Server error

## TypeScript Support

All hooks and API functions are fully typed:

```tsx
// Types are automatically inferred
const { data: user } = useCurrentUser(); // user: User | undefined

// Custom types for your API
interface CustomResponse {
    id: string;
    data: unknown;
}

const response = await apiClient.get<CustomResponse>("/custom-endpoint");
```

## Development Tools

### React Query DevTools

In development mode, DevTools are automatically enabled:

-   View all queries and their states
-   Manually trigger refetches
-   Inspect query cache
-   Debug mutations

### Error Logging

All API errors are automatically logged to the console in development mode.

## Best Practices

1. **Use Query Keys**: Always use the query keys factory for consistent cache management
2. **Handle Errors**: Use the error handling hooks for consistent error handling
3. **Loading States**: Always handle loading states in your UI
4. **Optimistic Updates**: Use optimistic updates for better UX
5. **Cache Invalidation**: Properly invalidate related queries after mutations

## Extending the Setup

### Adding New API Endpoints

1. Add new hooks in `src/lib/api/hooks.ts`
2. Add corresponding query keys in `src/lib/query/keys.ts`
3. Update types and interfaces as needed

### Custom Error Handling

1. Add new error codes in `src/lib/constants/error-codes.ts`
2. Update error handling logic in `src/lib/api/client.ts`
3. Add custom handlers in `useErrorHandler`

### Additional Mutations

Follow the existing patterns for new CRUD operations:

```tsx
export function useCustomMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CustomData) => apiClient.post<CustomResponse>("/custom-endpoint", data),
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: queryKeys.custom.all });
        },
    });
}
```
