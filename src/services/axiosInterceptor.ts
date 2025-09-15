import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import toast from 'react-hot-toast';

// Configuration de base d'axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://api.securitels.com/api/docs';

// Intercepteur de requête pour ajouter automatiquement le token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si le token est expiré ou invalide (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Déconnecter l'utilisateur
      const authStore = useAuthStore.getState();
      await authStore.logout();

      // Afficher un message
      toast.error('Session expirée. Veuillez vous reconnecter.');

      // Rediriger vers la page de connexion
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Si l'utilisateur n'a pas les permissions (403)
    if (error.response?.status === 403) {
      toast.error('Vous n\'avez pas les permissions nécessaires.');
    }

    // Si le serveur est indisponible (500+)
    if (error.response?.status >= 500) {
      toast.error('Une erreur serveur est survenue. Veuillez réessayer plus tard.');
    }

    return Promise.reject(error);
  }
);

// Fonction pour vérifier la validité du token JWT
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convertir en millisecondes
    return Date.now() > expirationTime;
  } catch (error) {
    return true; // Si on ne peut pas décoder le token, on considère qu'il est invalide
  }
};

// Fonction pour obtenir le temps restant avant expiration (en millisecondes)
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    return Math.max(0, expirationTime - Date.now());
  } catch (error) {
    return 0;
  }
};

export default axios;
