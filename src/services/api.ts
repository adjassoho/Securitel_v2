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
  AgentStats,
  ClientRegistration,
  WithdrawalRequest,
  Withdrawal,
  User,
  // AdminStats,
  // AdminUser,
  // AdminPhone,
  // AdminReport,
  // AdminAgent,
  // Commission,
  // SupportTicket,
  // AdminReportData,
  // SystemSettings,
  // AdminAlert, // Supprimé temporairement
  PoliceStats,
  PoliceSearchLog,
  PolicePhoneSearch,
  PolicePhoneResult,
  PoliceReport,
  PoliceCase,
  PoliceReportData,
  AgentAlert,
  AgentProfile,
  FAQItem,
  ReferralStats,
  TechnicianStats,
  TechnicianVerification,
  TechnicianReport,
  TechnicianWithdrawal,
  TechnicianProfile,
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
    // Log détaillé de l'erreur
    console.log('Erreur API interceptée:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Ne traiter la redirection que pour les erreurs 401 provenant de notre API interne
    if (error.response?.status === 401) {
      // Vérifier si l'erreur provient de notre API interne (pas OpenRouter)
      const isInternalAPI = error.config?.baseURL === API_BASE_URL;
      
      if (isInternalAPI) {
        // Ne pas rediriger automatiquement si nous sommes déjà sur certaines pages
        const currentPath = window.location.pathname;
        const exemptPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/diagnostic'];
        
        if (!exemptPaths.includes(currentPath)) {
          console.log('Redirection vers la page de connexion pour erreur 401 interne...');
          localStorage.removeItem('auth_token');
          delete api.defaults.headers.common['Authorization'];
          
          // Émettre un événement personnalisé au lieu de rediriger directement
          window.dispatchEvent(new CustomEvent('unauthorized-access'));
        }
      } else {
        // Erreur provenant d'une API externe (comme OpenRouter)
        console.log('Erreur 401 provenant d\'une API externe, pas de redirection automatique');
      }
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
    console.log('API validate2FA appelée:', { email, code });
    const response = await api.post('/validate-2fa', { email, code });
    console.log('Réponse validate2FA:', response.data);
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
    console.log('API verifyEmail appelée:', { email, code });
    const response = await api.post('/verify-email', { email, code });
    console.log('Réponse verifyEmail:', response.data);
    return response.data;
  },

  resendVerificationCode: async (email: string): Promise<void> => {
    console.log('Envoi du code de vérification pour:', email);
    const response = await api.post('/resend-verification-code', { email });
    console.log('Réponse du serveur:', response.data);
    return response.data;
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

  verifySerial: async (serialNumber: string): Promise<IMEIVerificationResult> => {
    const response = await api.get(`/phones/verify-serial/${serialNumber}`);
    return response.data;
  },

  getPhoneById: async (id: string): Promise<Phone> => {
    const response = await api.get(`/phones/${id}`);
    return response.data;
  },

  reportLoss: async (phoneId: string, data: any): Promise<void> => {
    await api.post(`/phones/${phoneId}/report-loss`, data);
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
  getHistory: async (filters?: { from?: string; to?: string; type?: string; search?: string }): Promise<HistoryItem[]> => {
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
    const response = await api.put('/user/password', data);
    return response.data;
  },

  enable2FA: async () => {
    const response = await api.post('/user/2fa/enable');
    return response.data;
  },

  disable2FA: async () => {
    await api.post('/user/2fa/disable');
  },

  updateNotifications: async (notifications: { email: boolean }) => {
    const response = await api.put('/user/notifications', notifications);
    return response.data;
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

// Services pour les agents/enregistreurs
export const agentService = {
  getStats: async (): Promise<AgentStats> => {
    const response = await api.get('/agent/stats');
    return response.data;
  },

  getRegistrations: async (filters?: { status?: string; from?: string; to?: string }): Promise<ClientRegistration[]> => {
    const response = await api.get('/agent/registrations', { params: filters });
    return response.data;
  },

  createClientAccount: async (data: FormData): Promise<{ user: User; password: string }> => {
    const response = await api.post('/agent/clients', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  registerClientPhone: async (clientId: string, data: FormData): Promise<Phone> => {
    const response = await api.post(`/agent/clients/${clientId}/phones`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateRegistration: async (registrationId: string, data: any): Promise<ClientRegistration> => {
    const response = await api.put(`/agent/registrations/${registrationId}`, data);
    return response.data;
  },

  requestWithdrawal: async (data: WithdrawalRequest): Promise<Withdrawal> => {
    const response = await api.post('/agent/withdrawals', data);
    return response.data;
  },

  getWithdrawals: async (): Promise<Withdrawal[]> => {
    const response = await api.get('/agent/withdrawals');
    return response.data;
  },

  getReferralLink: async (): Promise<{ link: string }> => {
    const response = await api.get('/agent/referral-link');
    return response.data;
  },

  // Vérification IMEI avant achat
  verifyIMEI: async (imei: string): Promise<IMEIVerificationResult> => {
    const response = await api.get(`/phones/verify/${imei}`);
    return response.data;
  },

  // Alertes et notifications
  getAlerts: async (): Promise<AgentAlert[]> => {
    const response = await api.get('/agent/alerts');
    return response.data;
  },

  markAlertAsRead: async (alertId: string): Promise<void> => {
    await api.put(`/agent/alerts/${alertId}/read`);
  },

  // Profil agent
  getProfile: async (): Promise<AgentProfile> => {
    const response = await api.get('/agent/profile');
    return response.data;
  },

  updateProfile: async (data: FormData): Promise<AgentProfile> => {
    const response = await api.put('/agent/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    await api.put('/agent/change-password', data);
  },

  // Centre d'aide
  getFAQ: async (): Promise<FAQItem[]> => {
    const response = await api.get('/agent/faq');
    return response.data;
  },

  contactSupport: async (data: { subject: string; message: string }): Promise<any> => {
    const response = await api.post('/agent/support', data);
    return response.data;
  },

  getSupportTickets: async (): Promise<any[]> => {
    const response = await api.get('/agent/support-tickets');
    return response.data;
  },

  // Statistiques de parrainage
  getReferralStats: async (): Promise<ReferralStats> => {
    const response = await api.get('/agent/referral-stats');
    return response.data;
  },

  // Rapports de commissions
  getCommissionReport: async (period: 'monthly' | 'yearly'): Promise<any> => {
    const response = await api.get('/agent/commission-report', { params: { period } });
    return response.data;
  },

  // Gestion des parrainages
  getReferrals: async (filters?: {
    search?: string;
    status?: string;
    from?: string;
    to?: string;
  }): Promise<any[]> => {
    const response = await api.get('/agent/referrals', { params: filters });
    return response.data;
  },

  getReferralById: async (referralId: string): Promise<any> => {
    const response = await api.get(`/agent/referrals/${referralId}`);
    return response.data;
  },

  // Génération de QR code pour le lien de parrainage
  generateReferralQRCode: async (): Promise<{ qr_code: string }> => {
    const response = await api.get('/agent/referral-qr-code');
    return response.data;
  },

  // Paiements Mobile Money
  initiateMobileMoneyPayment: async (data: {
    amount: number;
    phone_number: string;
    payment_method: 'mtn' | 'moov' | 'orange';
    description: string;
    reference: string;
  }): Promise<{ transaction_id: string; verification_code: string }> => {
    const response = await api.post('/agent/mobile-money/payment', data);
    return response.data;
  },

  checkPaymentStatus: async (transactionId: string): Promise<{
    status: 'pending' | 'success' | 'failed' | 'cancelled';
    transaction_id: string;
    message: string;
  }> => {
    const response = await api.get(`/agent/mobile-money/payment/${transactionId}/status`);
    return response.data;
  },

  // Création de client avancée
  createClient: async (data: FormData): Promise<any> => {
    const response = await api.post('/agent/clients', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Gestion des enregistrements
  getRegistrationById: async (id: string): Promise<any> => {
    const response = await api.get(`/agent/registrations/${id}`);
    return response.data;
  },

  updateRegistrationById: async (id: string, data: FormData): Promise<any> => {
    const response = await api.put(`/agent/registrations/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Alertes IMEI
  getIMEIAlerts: async (filters?: {
    search?: string;
    alert_type?: string;
    severity?: string;
    status?: string;
  }): Promise<any[]> => {
    const response = await api.get('/agent/imei-alerts', { params: filters });
    return response.data;
  },

  markIMEIAlertAsRead: async (alertId: string): Promise<void> => {
    await api.put(`/agent/imei-alerts/${alertId}/read`);
  },

  resolveIMEIAlert: async (alertId: string, notes: string): Promise<void> => {
    await api.put(`/agent/imei-alerts/${alertId}/resolve`, { notes });
  },
};

// Services pour l'admin - Supprimés temporairement
// export const adminService = {
//   // Dashboard et statistiques
//   getStats: async (): Promise<AdminStats> => {
//     const response = await api.get('/admin/stats');
//     return response.data;
//   },
//   // ... (tous les autres services admin commentés)
// };

// Services pour la Police
export const policeService = {
  // Authentification Police
  login: async (data: { email: string; password: string }): Promise<{ message: string }> => {
    const response = await api.post('/police/login', data);
    return response.data;
  },

  validate2FA: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await api.post('/police/validate-2fa', { email, code });
    const { access_token, user } = response.data;
    
    localStorage.setItem('auth_token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    return { token: access_token, user };
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/police/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
    }
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  },

  // Dashboard et statistiques
  getStats: async (period?: 'daily' | 'weekly' | 'monthly'): Promise<PoliceStats> => {
    const response = await api.get('/police/stats', { params: { period } });
    return response.data;
  },

  // Recherche de téléphones
  searchPhone: async (searchData: PolicePhoneSearch): Promise<PolicePhoneResult> => {
    const response = await api.post('/police/phones/search', searchData);
    return response.data;
  },

  quickVerify: async (imei: string, location?: string): Promise<PolicePhoneResult> => {
    const response = await api.get(`/police/phones/verify-quick/${imei}`, {
      params: { location }
    });
    return response.data;
  },

  getPhoneHistory: async (phoneId: string): Promise<any> => {
    const response = await api.get(`/police/phones/${phoneId}/full-history`);
    return response.data;
  },

  // Gestion des signalements
  getReports: async (filters?: {
    status?: string;
    type?: string;
    priority?: string;
    assigned_officer?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ reports: PoliceReport[]; total: number; page: number; total_pages: number }> => {
    const response = await api.get('/police/reports', { params: filters });
    return response.data;
  },

  getReportById: async (id: string): Promise<PoliceReport> => {
    const response = await api.get(`/police/reports/${id}`);
    return response.data;
  },

  updateReportStatus: async (id: string, status: string, reason?: string): Promise<PoliceReport> => {
    const response = await api.put(`/police/reports/${id}/status`, { status, reason });
    return response.data;
  },

  assignReport: async (id: string, officer_id: string): Promise<PoliceReport> => {
    const response = await api.post(`/police/reports/${id}/assign`, { officer_id });
    return response.data;
  },

  addReportNote: async (id: string, content: string, is_internal: boolean = false): Promise<void> => {
    await api.post(`/police/reports/${id}/notes`, { content, is_internal });
  },

  // Gestion des dossiers
  getCases: async (filters?: {
    status?: string;
    priority?: string;
    assigned_officer?: string;
    page?: number;
    limit?: number;
  }): Promise<{ cases: PoliceCase[]; total: number; page: number; total_pages: number }> => {
    const response = await api.get('/police/cases', { params: filters });
    return response.data;
  },

  getCaseById: async (id: string): Promise<PoliceCase> => {
    const response = await api.get(`/police/cases/${id}`);
    return response.data;
  },

  createCase: async (data: {
    title: string;
    description: string;
    priority: string;
    report_ids?: string[];
  }): Promise<PoliceCase> => {
    const response = await api.post('/police/cases', data);
    return response.data;
  },

  updateCaseStatus: async (id: string, status: string): Promise<PoliceCase> => {
    const response = await api.put(`/police/cases/${id}/status`, { status });
    return response.data;
  },

  assignCase: async (id: string, officer_id: string): Promise<PoliceCase> => {
    const response = await api.post(`/police/cases/${id}/assign`, { officer_id });
    return response.data;
  },

  addCaseNote: async (id: string, content: string, is_confidential: boolean = false): Promise<void> => {
    await api.post(`/police/cases/${id}/notes`, { content, is_confidential });
  },

  // Logs et traçabilité
  getSearchLogs: async (filters?: {
    officer_id?: string;
    action?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: PoliceSearchLog[]; total: number; page: number; total_pages: number }> => {
    const response = await api.get('/police/logs/search', { params: filters });
    return response.data;
  },

  exportSearchLogs: async (filters?: {
    officer_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Blob> => {
    const response = await api.get('/police/logs/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  // Rapports et exports
  generateReport: async (type: 'daily' | 'weekly' | 'monthly' | 'custom', filters?: {
    start_date?: string;
    end_date?: string;
  }): Promise<PoliceReportData> => {
    const response = await api.post('/police/reports/generate', { type, filters });
    return response.data;
  },

  exportReport: async (reportId: string, format: 'pdf' | 'excel'): Promise<Blob> => {
    const response = await api.get(`/police/reports/${reportId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Statistiques par localisation
  getStolenPhonesByLocation: async (filters?: {
    city?: string;
    department?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<{ location: string; count: number; phones: any[] }[]> => {
    const response = await api.get('/police/phones/stolen-by-location', { params: filters });
    return response.data;
  },
};

// Services pour les techniciens GSM
export const technicianService = {
  // Dashboard et statistiques
  getStats: async (): Promise<TechnicianStats> => {
    const response = await api.get('/technician/stats');
    return response.data;
  },

  getDashboard: async (): Promise<{
    stats: TechnicianStats;
    recent_verifications: TechnicianVerification[];
    recent_reports: TechnicianReport[];
    alerts: any[];
  }> => {
    const response = await api.get('/technician/dashboard');
    return response.data;
  },

  // Profil technicien
  getProfile: async (): Promise<TechnicianProfile> => {
    const response = await api.get('/technician/profile');
    return response.data;
  },

  updateProfile: async (data: FormData): Promise<TechnicianProfile> => {
    const response = await api.put('/technician/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCodeTGSM: async (): Promise<{ code_tgsm: string; qr_code: string }> => {
    const response = await api.get('/technician/code-tgsm');
    return response.data;
  },

  // Vérification IMEI
  verifyIMEI: async (data: {
    imei: string;
    verification_type: 'purchase' | 'repair' | 'inspection';
    location?: string;
    client_name?: string;
    client_phone?: string;
  }): Promise<TechnicianVerification> => {
    const response = await api.post('/technician/verify-imei', data);
    return response.data;
  },

  getVerifications: async (filters?: {
    status?: string;
    type?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    verifications: TechnicianVerification[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    const response = await api.get('/technician/verifications', { params: filters });
    return response.data;
  },

  getVerificationById: async (id: string): Promise<TechnicianVerification> => {
    const response = await api.get(`/technician/verifications/${id}`);
    return response.data;
  },

  // Signalements
  reportTheft: async (data: {
    phone_id: string;
    description: string;
    location: string;
    client_name?: string;
    client_phone?: string;
  }): Promise<TechnicianReport> => {
    const response = await api.post('/technician/reports/theft', data);
    return response.data;
  },

  reportSuspicious: async (data: {
    phone_id: string;
    description: string;
    location: string;
    client_name?: string;
    client_phone?: string;
  }): Promise<TechnicianReport> => {
    const response = await api.post('/technician/reports/suspicious', data);
    return response.data;
  },

  reportFound: async (data: {
    phone_id: string;
    description: string;
    location: string;
    client_name?: string;
    client_phone?: string;
  }): Promise<TechnicianReport> => {
    const response = await api.post('/technician/reports/found', data);
    return response.data;
  },

  getReports: async (filters?: {
    type?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    reports: TechnicianReport[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    const response = await api.get('/technician/reports', { params: filters });
    return response.data;
  },

  getReportById: async (id: string): Promise<TechnicianReport> => {
    const response = await api.get(`/technician/reports/${id}`);
    return response.data;
  },

  // Historique complet
  getHistory: async (filters?: {
    type?: 'verification' | 'report';
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    history: (TechnicianVerification | TechnicianReport)[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    const response = await api.get('/technician/history', { params: filters });
    return response.data;
  },

  // Enregistrements
  getRegistrations: async (filters?: {
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    registrations: any[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    const response = await api.get('/technician/registrations', { params: filters });
    return response.data;
  },

  // Comptabilité
  getAccounting: async (): Promise<{
    stats: TechnicianStats;
    recent_withdrawals: TechnicianWithdrawal[];
    earnings_by_month: { month: string; amount: number }[];
  }> => {
    const response = await api.get('/technician/accounting');
    return response.data;
  },

  requestWithdrawal: async (data: {
    amount: number;
    payment_method: 'mobile_money' | 'bank_transfer' | 'cash';
    payment_details: string;
    reason?: string;
  }): Promise<TechnicianWithdrawal> => {
    const response = await api.post('/technician/withdrawals', data);
    return response.data;
  },

  getWithdrawals: async (filters?: {
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    withdrawals: TechnicianWithdrawal[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    const response = await api.get('/technician/withdrawals', { params: filters });
    return response.data;
  },

  getWithdrawalById: async (id: string): Promise<TechnicianWithdrawal> => {
    const response = await api.get(`/technician/withdrawals/${id}`);
    return response.data;
  },

  // Paramètres
  updateSettings: async (data: {
    working_hours?: string;
    service_areas?: string[];
    contact_phone?: string;
    emergency_contact?: string;
    bank_details?: {
      bank_name: string;
      account_number: string;
      account_holder: string;
    };
    mobile_money_details?: {
      provider: 'mtn' | 'moov' | 'orange';
      phone_number: string;
      account_name: string;
    };
  }): Promise<TechnicianProfile> => {
    const response = await api.put('/technician/settings', data);
    return response.data;
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    await api.put('/technician/change-password', data);
  },

  // Déconnexion
  logout: async (): Promise<void> => {
    try {
      await api.post('/technician/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
    }
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  },
};