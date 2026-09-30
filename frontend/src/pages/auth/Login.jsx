import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROLE_GROUPS } from '../../utils/constants';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (ROLE_GROUPS.ADMIN_TEAM.includes(user.role)) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/member/home', { replace: true });
      }
    }
  }, [user, navigate]);

  const onSubmit = async (values) => {
    const payload = { ...values };
    if (!payload.username) return;
    await login(payload);
    const next = location.state?.from?.pathname;
    if (next) {
      navigate(next, { replace: true });
      return;
    }
    const latest = useAuthStore.getState().user;
    if (ROLE_GROUPS.ADMIN_TEAM.includes(latest?.role)) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/member/home', { replace: true });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">
            Username or Email
          </label>
          <input
            id="username"
            type="text"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-100"
            placeholder="samuel@example.com"
            {...register('username', { required: 'Please provide your username or email' })}
          />
          {errors.username ? <p className="text-xs text-rose-500">{errors.username.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-100"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-semibold text-primary-600 hover:text-primary-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-rose-500">{errors.password.message}</p> : null}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted">
        <label className="inline-flex items-center gap-2 text-xs">
          <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
          Remember me
        </label>
        <Link to="/register" className="text-xs font-semibold text-primary-600 hover:text-primary-500">
          Need an account?
        </Link>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="text-center text-xs text-muted">
        By signing in, you agree to our{' '}
        <span className="font-semibold text-primary-600">Terms of Service</span>
      </p>
    </form>
  );
};

export default LoginPage;
