import axios from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Phone,
  RegisterPhoneRequest,
  PhoneStatusUpdate,
  TransferOwnershipRequest,
  IMEIVerificationResult,
  SuspiciousPhoneReport,
  TheftReport,
  LossReport,
  FoundPhoneReport,
  HistoryItem,
  PasswordChangeRequest,
  ProfileUpdateRequest,
  DashboardStats,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.securitels.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
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

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  // Step 1: Initial login request that triggers 2FA code
  login: async (data: LoginRequest): Promise<{ message: string }> => {
    const response = await api.post('/login', data);
    return response.data;
  },

  // Step 2: Validate 2FA code to get token and user data
  validate2FA: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await api.post('/validate-2fa', { email, code });
    const { access_token, user } = response.data;
    
    // Store token and set default header
    localStorage.setItem('auth_token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    return { token: access_token, user };
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
    }
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string, password_confirmation: string): Promise<void> => {
    await api.post('/reset-password', { token, password, password_confirmation });
  },

  verifyEmail: async (email: string, code: string): Promise<void> => {
    await api.post('/verify-email', { email, code });
  },

  resendVerificationCode: async (email: string): Promise<void> => {
    await api.post('/resend-verification-code', { email });
  },
};

// Services pour les téléphones
export const phoneService = {
  getMyPhones: async (): Promise<Phone[]> => {
    const response = await api.get('/phones/my-phones');
    return response.data;
  },

  registerPhone: async (data: RegisterPhoneRequest): Promise<Phone> => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof RegisterPhoneRequest];
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });

    const response = await api.post('/phones/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePhoneStatus: async (data: PhoneStatusUpdate): Promise<Phone> => {
    const response = await api.put(`/phones/${data.phone_id}/status`, {
      status: data.status,
      note: data.note,
      verification_code: data.verification_code,
    });
    return response.data;
  },

  transferOwnership: async (data: TransferOwnershipRequest): Promise<void> => {
    await api.post(`/phones/${data.phone_id}/transfer`, {
      new_owner_name: data.new_owner_name,
      new_owner_email: data.new_owner_email,
      new_owner_phone: data.new_owner_phone,
      verification_code: data.verification_code,
    });
  },

  verifyIMEI: async (imei: string): Promise<IMEIVerificationResult> => {
    const response = await api.get(`/phones/verify/${imei}`);
    return response.data;
  },

  getPhoneById: async (id: string): Promise<Phone> => {
    const response = await api.get(`/phones/${id}`);
    return response.data;
  },
};

// Services pour les signalements
export const reportService = {
  reportSuspicious: async (data: SuspiciousPhoneReport): Promise<void> => {
    await api.post('/reports/suspicious', data);
  },

  reportTheft: async (data: TheftReport): Promise<void> => {
    await api.post('/reports/theft', data);
  },

  reportLoss: async (data: LossReport): Promise<void> => {
    await api.post('/reports/loss', data);
  },

  reportFound: async (data: FoundPhoneReport): Promise<void> => {
    await api.post('/reports/found', data);
  },
};

// Services pour l'historique
export const historyService = {
  getHistory: async (filters?: { from?: string; to?: string; type?: string }): Promise<HistoryItem[]> => {
    const response = await api.get('/history', { params: filters });
    return response.data;
  },
};

// Services pour le profil utilisateur
export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateRequest) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  changePassword: async (data: PasswordChangeRequest) => {
    await api.put('/user/password', data);
  },

  enable2FA: async () => {
    const response = await api.post('/user/2fa/enable');
    return response.data;
  },

  disable2FA: async () => {
    await api.post('/user/2fa/disable');
  },

  updateNotifications: async (notifications: { email: boolean; sms: boolean }) => {
    await api.put('/user/notifications', notifications);
  },

  applyAsAgent: async (data: FormData) => {
    const response = await api.post('/user/agent-application', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Services pour le tableau de bord
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

// Service de paiement
export const paymentService = {
  initiatePayment: async (amount: number, type: 'registration' | 'report') => {
    const response = await api.post('/payments/initiate', { amount, type });
    return response.data;
  },

  verifyPayment: async (reference: string) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  },
};
