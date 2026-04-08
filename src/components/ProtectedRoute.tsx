import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
}) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Nếu route yêu cầu đăng nhập nhưng chưa đăng nhập
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập nhưng không đúng role
  if (requireAuth && allowedRoles && allowedRoles.length > 0) {
    const role = userRole?.toLowerCase() ?? '';
    const allowed = allowedRoles.map(r => r.toLowerCase());
    if (!allowed.includes(role)) {
      return <Navigate to="/404" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
