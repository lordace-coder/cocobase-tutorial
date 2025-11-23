import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, User } from '../types';
import db from '../lib/cocobase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          await db.auth.login(email, password);
          const user = db.auth.getUser();

          set({
            user: user as any,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Login failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        db.auth.logout();
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          await db.auth.initAuth();
          const user = db.auth.getUser();
          set({
            user: user as any,
            isAuthenticated: !!user,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'auth-storage', // Key in localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
