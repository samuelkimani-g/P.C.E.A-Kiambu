import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/common/LoadingScreen';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) {
    return <LoadingScreen fullscreen label="Preparing your workspace..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'member') {
      return <Navigate to="/member/home" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
