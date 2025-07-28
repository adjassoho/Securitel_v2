import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

// Layouts
import PublicLayout from '@/components/layouts/PublicLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// Pages publiques
import HomePage from '@/pages/public/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

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

// Composant de protection des routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
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
            <Route path="/become-agent" element={<BecomeAgentPage />} />
          </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
