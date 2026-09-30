import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    if (user.role === 'member') {
      return <Navigate to="/member/home" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
