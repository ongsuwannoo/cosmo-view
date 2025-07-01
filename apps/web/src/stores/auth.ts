import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AuthState {
  user: { email: string; name: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        login: async (email: string, _password: string) => {
          set({ isLoading: true });
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({
            user: { email, name: email.split('@')[0] || 'User' },
            isLoading: false,
          });
        },
        logout: () => {
          set({ user: null });
        },
      }),
      {
        name: 'auth-storage',
      }
    ),
    {
      name: 'auth-storage',
    }
  )
);
