import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { isTokenExpired } from '@/services/axiosInterceptor';
import { authService } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  validate2FA: (email: string, code: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  setAuthenticated: (user: User, token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.login({ email, password });
          // La méthode login retourne seulement un message, pas de token
          // Le token sera obtenu après validation 2FA
          set({
            isLoading: false,
          });

          // Vérifie l'expiration du token
          const token = localStorage.getItem('auth_token');
          if (token && isTokenExpired(token)) {
            await get().logout();
            // toast.error('Session expirée. Veuillez vous reconnecter.');
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Erreur de connexion',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(data);
          // La méthode register retourne seulement un message
          set({
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Erreur lors de l\'inscription',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        try {
          await authService.logout();
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
        } finally {
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      validate2FA: async (email: string, code: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.validate2FA(email, code);
          localStorage.setItem('auth_token', response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Code incorrect',
            isLoading: false,
          });
          throw error;
        }
      },

      updateUser: (user: User) => {
        set({ user });
      },

      setAuthenticated: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
