import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface Props {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const roleRoutes: Record<UserRole, string> = {
      [UserRole.APPLICANT]: '/applicant',
      [UserRole.STATE_REVIEWER]: '/state',
      [UserRole.CENTRAL_REVIEWER]: '/central',
      [UserRole.ADMIN]: '/admin',
    };
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return <Outlet />;
}
