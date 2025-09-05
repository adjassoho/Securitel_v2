// Types pour l'analyse IA
export interface IAExtractedData {
  imei1?: string;
  imei2?: string;
  serialNumber?: string;
  ram?: string;
  storage?: string;
}

export interface IAValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  extractedData: IAExtractedData;
  imeiCount: number;
  userImeiCount: number;
}

export interface DualIMEIValidation {
  imei1Match: boolean;
  imei2Match: boolean;
  hasUnmatchedExtracted: boolean;
  hasUnmatchedUser: boolean;
  extractedCount: number;
  userCount: number;
  missingImeiFields: string[];
  suggestions: string[];
}

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
  role: 'user' | 'agent' | 'admin' | 'super_admin' | 'police';
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
  imei1: string;
  imei2: string;
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
  address?: string;
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

// Types pour l'admin
export interface AdminStats {
  total_users: number;
  total_phones: number;
  active_reports: number;
  users_by_city: { city: string; count: number }[];
  active_technicians: number;
  total_revenue: number;
  reports_by_status: { status: string; count: number }[];
  recent_activities: AdminActivity[];
  alerts: AdminAlert[];
}

export interface AdminActivity {
  id: string;
  type: 'user_registration' | 'phone_registration' | 'report_created' | 'agent_application' | 'payment_processed';
  description: string;
  user_id?: string;
  user_name?: string;
  timestamp: string;
  details?: any;
}

export interface AdminAlert {
  id: string;
  type: 'fraud_suspicion' | 'high_reports' | 'system_anomaly' | 'security_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  action_required: boolean;
}

export interface AdminUser extends User {
  last_login?: string;
  is_active: boolean;
  registration_source: string;
  total_phones: number;
  total_reports: number;
  city?: string;
  department?: string;
}

export interface AdminPhone extends Phone {
  owner: AdminUser;
  registration_date: string;
  last_activity: string;
  status_history: PhoneStatusHistory[];
  reports_count: number;
}

export interface PhoneStatusHistory {
  id: string;
  status: string;
  changed_by: string;
  changed_at: string;
  reason?: string;
  note?: string;
}

export interface AdminReport {
  id: string;
  type: 'theft' | 'loss' | 'found' | 'suspicious';
  status: 'pending' | 'validated' | 'transmitted_police' | 'resolved';
  phone: AdminPhone;
  reporter: AdminUser;
  created_at: string;
  updated_at: string;
  assigned_agent?: AdminUser;
  police_reference?: string;
  resolution_notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AdminAgent extends User {
  agent_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  application_date: string;
  approval_date?: string;
  total_registrations: number;
  total_commission: number;
  performance_score: number;
  documents: AgentDocument[];
  last_activity: string;
}

export interface AgentDocument {
  id: string;
  type: 'id_card' | 'business_license' | 'proof_of_address' | 'other';
  filename: string;
  url: string;
  uploaded_at: string;
  verified: boolean;
}

export interface Commission {
  id: string;
  agent_id: string;
  agent_name: string;
  amount: number;
  type: 'registration' | 'referral' | 'bonus';
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
  paid_at?: string;
  reference: string;
}

export interface SupportTicket {
  id: string;
  user: AdminUser;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'account' | 'other';
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  resolution_time?: number; // en minutes
  satisfaction_score?: number;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender: 'user' | 'admin' | 'system';
  sender_name: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface AdminReportData {
  period: {
    start: string;
    end: string;
  };
  users: {
    total: number;
    new: number;
    active: number;
    by_role: { role: string; count: number }[];
  };
  phones: {
    total: number;
    registered: number;
    stolen: number;
    found: number;
    by_status: { status: string; count: number }[];
  };
  reports: {
    total: number;
    resolved: number;
    pending: number;
    by_type: { type: string; count: number }[];
  };
  revenue: {
    total: number;
    commissions: number;
    fees: number;
    by_month: { month: string; amount: number }[];
  };
}

export interface SystemSettings {
  fees: {
    registration_fee: number;
    verification_fee: number;
    transfer_fee: number;
  };
  commissions: {
    agent_registration: number;
    agent_referral: number;
    technician_commission: number;
  };
  notifications: {
    email_enabled: boolean;
    sms_enabled: boolean;
    push_enabled: boolean;
  };
  security: {
    session_timeout: number;
    max_login_attempts: number;
    require_2fa: boolean;
  };
}

// Types pour la Police
export interface PoliceUser extends User {
  badge_number: string;
  department: string;
  rank?: string;
  is_active: boolean;
  last_login?: string;
  permissions: PolicePermission[];
}

export interface PolicePermission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
}

export interface PoliceStats {
  total_stolen_phones: number;
  total_recovered_phones: number;
  active_reports: number;
  resolved_reports: number;
  reports_by_status: { status: string; count: number }[];
  reports_by_city: { city: string; count: number }[];
  recent_activities: PoliceActivity[];
  search_logs_count: number;
}

export interface PoliceActivity {
  id: string;
  type: 'search' | 'report_view' | 'status_update' | 'case_assignment';
  description: string;
  officer_id: string;
  officer_name: string;
  timestamp: string;
  details: any;
}

export interface PoliceSearchLog {
  id: string;
  officer_id: string;
  officer_name: string;
  search_type: 'imei' | 'serial' | 'phone_number' | 'owner_name';
  search_value: string;
  result_found: boolean;
  phone_id?: string;
  timestamp: string;
  location?: string;
  case_reference?: string;
}

export interface PolicePhoneSearch {
  imei: string;
  serial_number?: string;
  phone_number?: string;
  owner_name?: string;
  search_reason: string;
  case_reference?: string;
  location?: string;
}

export interface PolicePhoneResult {
  found: boolean;
  phone?: {
    id: string;
    imei1: string;
    imei2?: string;
    serial_number?: string;
    brand: string;
    model: string;
    color: string;
    status: string;
    owner: {
      id: string;
      name: string;
      phone: string;
      email: string;
    };
    registration_date: string;
    last_activity: string;
    is_stolen: boolean;
    theft_report?: {
      id: string;
      theft_date: string;
      theft_location: string;
      description: string;
      status: string;
      case_reference?: string;
    };
    status_history: PhoneStatusHistory[];
  };
  search_log_id: string;
}

export interface PoliceReport {
  id: string;
  type: 'theft' | 'loss' | 'found' | 'suspicious';
  status: 'pending' | 'validated' | 'transmitted_police' | 'in_investigation' | 'resolved' | 'closed';
  phone: {
    id: string;
    imei1: string;
    imei2?: string;
    serial_number?: string;
    brand: string;
    model: string;
    color: string;
    owner: {
      id: string;
      name: string;
      phone: string;
      email: string;
      address?: string;
    };
  };
  reporter: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  assigned_officer?: {
    id: string;
    name: string;
    badge_number: string;
  };
  police_reference?: string;
  case_number?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  description: string;
  evidence_files?: string[];
  notes: PoliceReportNote[];
  status_history: PoliceReportStatusHistory[];
}

export interface PoliceReportNote {
  id: string;
  content: string;
  officer_id: string;
  officer_name: string;
  timestamp: string;
  is_internal: boolean;
}

export interface PoliceReportStatusHistory {
  id: string;
  status: string;
  changed_by: string;
  changed_by_name: string;
  changed_at: string;
  reason?: string;
  note?: string;
}

export interface PoliceCase {
  id: string;
  case_number: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_officer_id: string;
  assigned_officer_name: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  reports: PoliceReport[];
  notes: PoliceCaseNote[];
}

export interface PoliceCaseNote {
  id: string;
  content: string;
  officer_id: string;
  officer_name: string;
  timestamp: string;
  is_confidential: boolean;
}

export interface PoliceReportData {
  period: {
    start: string;
    end: string;
  };
  summary: {
    total_reports: number;
    resolved_reports: number;
    pending_reports: number;
    stolen_phones: number;
    recovered_phones: number;
  };
  by_type: {
    theft: number;
    loss: number;
    found: number;
    suspicious: number;
  };
  by_status: {
    pending: number;
    validated: number;
    in_investigation: number;
    resolved: number;
    closed: number;
  };
  by_city: { city: string; count: number }[];
  by_officer: { officer_name: string; reports_handled: number }[];
  timeline: {
    date: string;
    reports_created: number;
    reports_resolved: number;
  }[];
}

// Types pour les agents/enregistreurs
export interface AgentAlert {
  id: string;
  type: 'registration_update' | 'withdrawal_approved' | 'withdrawal_rejected' | 'profile_verification' | 'imei_stolen_detected';
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface IMEIVerificationResult {
  imei: string;
  status: 'normal' | 'stolen' | 'lost' | 'unknown';
  brand?: string;
  model?: string;
  color?: string;
  registration_date?: string;
  city?: string;
  owner_name?: string;
  phone_type?: 'smartphone' | 'feature_phone' | 'tablet' | 'other';
  ram?: string;
  storage?: string;
  serial_number?: string;
}

export interface AgentProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
  id_type: 'cni' | 'passport' | 'voter_card';
  id_number: string;
  is_verified: boolean;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ReferralStats {
  total_referrals: number;
  active_referrals: number;
  total_commission_earned: number;
  monthly_commission: number;
  referral_link: string;
}
