import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleRedirect = () => {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'member') {
    return <Navigate to="/member/home" replace />;
  }

  return <Navigate to="/admin/dashboard" replace />;
};

export default RoleRedirect;
