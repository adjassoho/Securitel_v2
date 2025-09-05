import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/useAuthStore';
import CookieBanner from '@/components/ui/CookieBanner';
import ScrollToTopOnRouteChange from '@/components/ui/ScrollToTopOnRouteChange';

// Layouts
import PublicLayout from '@/components/layouts/PublicLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';

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
  
  if (user?.role !== 'agent' && user?.role !== 'admin') {
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
            <Route path="/agent/create-client" element={<CreateClientPage />} />
            <Route path="/agent/register-phone" element={<AgentRegisterPhonePage />} />
            {/* TODO: Ajouter les autres routes agent */}
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
