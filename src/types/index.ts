// Types pour l'authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address?: string;
  whatsapp?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  whatsapp?: string;
  role: 'user' | 'agent' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Types pour les téléphones
export interface Phone {
  id: string;
  imei1: string;
  imei2: string;
  brand: string;
  model: string;
  ram: string;
  storage: string;
  serial_number: string;
  status: 'legitimate' | 'stolen' | 'lost' | 'recovered';
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterPhoneRequest {
  imei1: string;
  imei2: string;
  brand: string;
  model: string;
  ram: string;
  storage: string;
  serial_number: string;
  imei_proof: File;
  serial_proof: File;
  specs_proof: File;
}

export interface PhoneStatusUpdate {
  phone_id: string;
  status: 'recovered';
  note?: string;
  verification_code: string;
}

export interface TransferOwnershipRequest {
  phone_id: string;
  new_owner_name: string;
  new_owner_email: string;
  new_owner_phone: string;
  verification_code: string;
}

// Types pour les vérifications et signalements
export interface IMEIVerificationResult {
  found: boolean;
  phone?: {
    imei: string;
    serial_number: string;
    status: string;
  };
}

export interface SuspiciousPhoneReport {
  reporter_phone: string;
  holder_phone: string;
}

export interface TheftReport {
  phone_id: string;
  theft_date: string;
  theft_location: string;
  description: string;
  emergency_contact: string;
  verification_code: string;
}

export interface LossReport {
  phone_id: string;
  loss_date: string;
  loss_location: string;
  description: string;
  emergency_contact: string;
  verification_code: string;
}

export interface FoundPhoneReport {
  serial_number: string;
  found_date: string;
  found_location: string;
  reporter_phone: string;
}

// Types pour l'historique
export interface HistoryItem {
  id: string;
  action_type: 'registration' | 'verification' | 'status_change' | 'transfer' | 'report';
  description: string;
  phone_imei?: string;
  created_at: string;
}

// Types pour les paramètres
export interface PasswordChangeRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ProfileUpdateRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
}

export interface AgentApplicationRequest {
  cni_number: string;
  id_document: File;
  quiz_score: number;
}

// Types pour l'enregistreur/agent
export interface AgentStats {
  total_registrations: number;
  validated_registrations: number;
  rejected_registrations: number;
  pending_registrations: number;
  total_revenue: number;
  available_balance: number;
  referral_link: string;
}

export interface ClientRegistration {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  phone_imei: string;
  status: 'pending' | 'validated' | 'rejected';
  created_at: string;
  commission: number;
  rejection_reason?: string;
}

export interface WithdrawalRequest {
  amount: number;
  method: 'mtn' | 'moov';
  phone_number: string;
  beneficiary_name: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  processed_at?: string;
  admin_comment?: string;
}

export interface CreateClientAccountRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  id_type: 'cni' | 'passport' | 'voter_card';
  id_number: string;
  id_document: File;
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'email' | 'sms';
  enabled: boolean;
}

// Types pour le tableau de bord
export interface DashboardStats {
  total_phones: number;
  total_actions: number;
  recent_activities: HistoryItem[];
}
