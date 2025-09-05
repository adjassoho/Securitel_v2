import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

interface PoliceRouteProps {
  children: React.ReactNode;
}

const PoliceRoute = ({ children }: PoliceRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'police') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PoliceRoute;
