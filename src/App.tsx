import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/useAuthStore';
import CookieBanner from '@/components/ui/CookieBanner';
import ScrollToTopOnRouteChange from '@/components/ui/ScrollToTopOnRouteChange';

// Layouts
import PublicLayout from '@/components/layouts/PublicLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';
// import AdminLayout from '@/components/layouts/AdminLayout'; // Supprimé temporairement
import PoliceLayout from '@/components/layouts/PoliceLayout';

// Pages publiques
import HomePage from '@/pages/public/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyRegistrationPage from '@/pages/auth/VerifyRegistrationPage';
import Enter2FACodePage from '@/pages/auth/Enter2FACodePage';
import ContactPage from '@/pages/public/ContactPage';
import LegalPage from '@/pages/public/LegalPage';
import PrivacyPage from '@/pages/public/PrivacyPage';
import TermsPage from '@/pages/public/TermsPage';
import CookiesPage from '@/pages/public/CookiesPage';

// Pages protégées
import DashboardPage from '@/pages/dashboard/DashboardPage';
import MyPhonesPage from '@/pages/phones/MyPhonesPage';
import RegisterPhonePage from '@/pages/phones/RegisterPhonePage';
import ManageStatusPage from '@/pages/phones/ManageStatusPage';
import TransferOwnershipPage from '@/pages/phones/TransferOwnershipPage';
import VerifyIMEIPage from '@/pages/verification/VerifyIMEIPage';
import ReportSuspiciousPage from '@/pages/reports/ReportSuspiciousPage';
import ReportTheftPage from '@/pages/reports/ReportTheftPage';
import ReportLossPage from '@/pages/reports/ReportLossPage';
import ReportFoundPage from '@/pages/reports/ReportFoundPage';
import HistoryPage from '@/pages/history/HistoryPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import SettingsPage from '@/pages/profile/SettingsPage';
import BecomeAgentPage from '@/pages/profile/BecomeAgentPage';
import DiagnosticTestPage from '@/pages/diagnostic/DiagnosticTestPage';

// Pages agent
import AgentDashboard from '@/pages/agent/AgentDashboard';
import ClientsPage from '@/pages/agent/ClientsPage';
import AgentVerifyIMEIPage from '@/pages/agent/VerifyIMEIPage';
import MyRegistrationsPage from '@/pages/agent/MyRegistrationsPage';
import AccountingPage from '@/pages/agent/AccountingPage';
import HelpSupportPage from '@/pages/agent/HelpSupportPage';
import ReferralStatsPage from '@/pages/agent/ReferralStatsPage';
import ReferralsPage from '@/pages/agent/ReferralsPage';
import AdvancedRegisterPhonePage from '@/pages/agent/AdvancedRegisterPhonePage';
import AdvancedCreateClientPage from '@/pages/agent/AdvancedCreateClientPage';
import MobileMoneyPaymentPage from '@/pages/agent/MobileMoneyPaymentPage';
import EditRegistrationPage from '@/pages/agent/EditRegistrationPage';
import IMEIAlertsPage from '@/pages/agent/IMEIAlertsPage';
import AgentProfilePage from '@/pages/agent/AgentProfilePage';

// Pages technicien
import TechnicianDashboard from '@/pages/technician/TechnicianDashboard';
import TechnicianVerifyIMEIPage from '@/pages/technician/TechnicianVerifyIMEIPage';
import TechnicianCodeTGSMPage from '@/pages/technician/TechnicianCodeTGSMPage';
import TechnicianReportTheftPage from '@/pages/technician/TechnicianReportTheftPage';
import TechnicianHistoryPage from '@/pages/technician/TechnicianHistoryPage';
import TechnicianRegistrationsPage from '@/pages/technician/TechnicianRegistrationsPage';
import TechnicianAccountingPage from '@/pages/technician/TechnicianAccountingPage';
import TechnicianSettingsPage from '@/pages/technician/TechnicianSettingsPage';

// Pages admin - Supprimées temporairement
// import AdminDashboard from '@/pages/admin/AdminDashboard';
// import UsersPage from '@/pages/admin/UsersPage';
// import PhonesPage from '@/pages/admin/PhonesPage';
// import AdminReportsPage from '@/pages/admin/ReportsPage';
// import AgentsPage from '@/pages/admin/AgentsPage';
// import AdminStatsPage from '@/pages/admin/StatsPage';

// Pages police
import PoliceDashboard from '@/pages/police/PoliceDashboard';
import QuickSearchPage from '@/pages/police/QuickSearchPage';
import AdvancedSearchPage from '@/pages/police/AdvancedSearchPage';
import SearchHistoryPage from '@/pages/police/SearchHistoryPage';
import ReportsPage from '@/pages/police/ReportsPage';
import CasesPage from '@/pages/police/CasesPage';
import CreateCasePage from '@/pages/police/CreateCasePage';
import StatsPage from '@/pages/police/StatsPage';
import CreateClientPage from '@/pages/agent/CreateClientPage';
import AgentRegisterPhonePage from '@/pages/agent/RegisterPhonePage';

// Composant de protection des routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Composant de protection des routes agent
const AgentRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'agent') { // && user?.role !== 'admin' supprimé temporairement
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Composant de protection des routes technicien
const TechnicianRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'technician') { // && user?.role !== 'admin' supprimé temporairement
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Composant de protection des routes admin - Supprimé temporairement
// const AdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, user } = useAuthStore();
//   
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   
//   if (user?.role !== 'admin') {
//     return <Navigate to="/dashboard" replace />;
//   }
//   
//   return <>{children}</>;
// };

// Composant de protection des routes police
const PoliceRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'police') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <>
      <Router>
        <ScrollToTopOnRouteChange />
        <Routes>
          {/* Routes publiques */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyRegistrationPage />} />
            <Route path="/verify-2fa" element={<Enter2FACodePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
          </Route>

          {/* Routes protégées */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Mes téléphones */}
            <Route path="/phones" element={<MyPhonesPage />} />
            <Route path="/phones/register" element={<RegisterPhonePage />} />
            <Route path="/phones/:id/status" element={<ManageStatusPage />} />
            <Route path="/phones/:id/transfer" element={<TransferOwnershipPage />} />
            
            {/* Vérification & Signalement */}
            <Route path="/verify" element={<VerifyIMEIPage />} />
            <Route path="/report/suspicious" element={<ReportSuspiciousPage />} />
            <Route path="/report/theft" element={<ReportTheftPage />} />
            <Route path="/report/loss" element={<ReportLossPage />} />
            <Route path="/report/found" element={<ReportFoundPage />} />
            
            {/* Historique */}
            <Route path="/history" element={<HistoryPage />} />
            
            {/* Profil & Paramètres */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile/become-agent" element={<BecomeAgentPage />} />
            
            {/* Diagnostic */}
            <Route path="/diagnostic" element={<DiagnosticTestPage />} />
          </Route>

          {/* Routes agent */}
          <Route
            element={
              <AgentRoute>
                <DashboardLayout />
              </AgentRoute>
            }
          >
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/clients" element={<ClientsPage />} />
            <Route path="/agent/create-client" element={<CreateClientPage />} />
            <Route path="/agent/register-phone" element={<AgentRegisterPhonePage />} />
            <Route path="/agent/verify-imei" element={<AgentVerifyIMEIPage />} />
            <Route path="/agent/registrations" element={<MyRegistrationsPage />} />
            <Route path="/agent/accounting" element={<AccountingPage />} />
            <Route path="/agent/help" element={<HelpSupportPage />} />
            <Route path="/agent/referrals" element={<ReferralsPage />} />
            <Route path="/agent/referral-stats" element={<ReferralStatsPage />} />
            <Route path="/agent/advanced-register-phone" element={<AdvancedRegisterPhonePage />} />
            <Route path="/agent/advanced-create-client" element={<AdvancedCreateClientPage />} />
            <Route path="/agent/mobile-money-payment" element={<MobileMoneyPaymentPage />} />
            <Route path="/agent/edit-registration/:id" element={<EditRegistrationPage />} />
            <Route path="/agent/imei-alerts" element={<IMEIAlertsPage />} />
            <Route path="/agent/profile" element={<AgentProfilePage />} />
            {/* TODO: Ajouter les autres routes agent */}
          </Route>

          {/* Routes admin - Supprimées temporairement */}
          {/* <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/phones" element={<PhonesPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/agents" element={<AgentsPage />} />
            <Route path="/admin/stats" element={<AdminStatsPage />} />
          </Route> */}

          {/* Routes police */}
          <Route
            element={
              <PoliceRoute>
                <PoliceLayout />
              </PoliceRoute>
            }
          >
            <Route path="/police" element={<PoliceDashboard />} />
            <Route path="/police/dashboard" element={<PoliceDashboard />} />
            
            {/* Recherche */}
            <Route path="/police/search/quick" element={<QuickSearchPage />} />
            <Route path="/police/search/advanced" element={<AdvancedSearchPage />} />
            <Route path="/police/search/history" element={<SearchHistoryPage />} />
            
            {/* Signalements */}
            <Route path="/police/reports" element={<ReportsPage />} />
            
            {/* Dossiers */}
            <Route path="/police/cases" element={<CasesPage />} />
            <Route path="/police/cases/create" element={<CreateCasePage />} />
            
            {/* Statistiques */}
            <Route path="/police/stats" element={<StatsPage />} />
            <Route path="/police/stats/location" element={<StatsPage />} />
            <Route path="/police/stats/reports" element={<StatsPage />} />
            <Route path="/police/stats/exports" element={<StatsPage />} />
          </Route>

          {/* Routes technicien */}
          <Route
            element={
              <TechnicianRoute>
                <DashboardLayout />
              </TechnicianRoute>
            }
          >
            <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
            <Route path="/technician/verify-imei" element={<TechnicianVerifyIMEIPage />} />
            <Route path="/technician/code-tgsm" element={<TechnicianCodeTGSMPage />} />
            <Route path="/technician/report-theft" element={<TechnicianReportTheftPage />} />
            <Route path="/technician/history" element={<TechnicianHistoryPage />} />
            <Route path="/technician/registrations" element={<TechnicianRegistrationsPage />} />
            <Route path="/technician/accounting" element={<TechnicianAccountingPage />} />
            <Route path="/technician/settings" element={<TechnicianSettingsPage />} />
          </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Cookie Banner */}
        <CookieBanner />
      </Router>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
}

export default App;
