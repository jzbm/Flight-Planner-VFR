import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ access_token: string; user: User }>(
            '/auth/login',
            { email, password }
          );
          set({
            token: response.access_token,
            user: response.user,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message || 'Login failed', isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ access_token: string; user: User }>(
            '/auth/register',
            { email, password, name }
          );
          set({
            token: response.access_token,
            user: response.user,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message || 'Registration failed', isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
