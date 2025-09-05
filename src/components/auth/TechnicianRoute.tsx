import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

interface TechnicianRouteProps {
  children: React.ReactNode;
}

const TechnicianRoute = ({ children }: TechnicianRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'technician') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default TechnicianRoute;
