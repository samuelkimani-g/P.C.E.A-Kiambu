import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROLE_GROUPS, DISTRICTS } from '../../utils/constants';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: '',
      phone_number: '',
      email: '',
      district: '',
      password: '',
      confirm_password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const submitRegister = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const [firstName, ...rest] = values.full_name.trim().split(' ');
    const lastName = rest.join(' ');
    const usernameFromEmail = values.email.includes('@') ? values.email.split('@')[0] : values.email;

    const payload = {
      username: usernameFromEmail,
      email: values.email,
      password: values.password,
      password2: values.confirm_password,
      first_name: firstName,
      last_name: lastName,
      phone_number: values.phone_number,
      district: values.district,
    };

    const result = await submitRegister(payload);
    const user = result?.user || useAuthStore.getState().user;
    if (ROLE_GROUPS.ADMIN_TEAM.includes(user?.role)) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/member/home', { replace: true });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-2">
          <label htmlFor="full_name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="full_name"
            type="text"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-100"
            placeholder="Samuel Kamau"
            {...register('full_name', { required: 'Your full name is required' })}
          />
          {errors.full_name ? <p className="text-xs text-rose-500">{errors.full_name.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone_number" className="text-sm font-medium text-slate-700">
            Phone number
          </label>
          <input
            id="phone_number"
            type="tel"
            placeholder="+254712345678"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-100"
            {...register('phone_number', { required: 'Phone number is required' })}
          />
          {errors.phone_number ? <p className="text-xs text-rose-500">{errors.phone_number.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="samuel@example.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-100"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="district" className="text-sm font-medium text-slate-700">
            District / Fellowship
          </label>
          <select
            id="district"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-100"
            {...register('district', { required: 'Please select your district' })}
          >
            <option value="">Select district</option>
            {DISTRICTS.map((district) => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>
          {errors.district ? <p className="text-xs text-rose-500">{errors.district.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-100"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Use at least 8 characters' },
              })}
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

        <div className="space-y-2">
          <label htmlFor="confirm_password" className="text-sm font-medium text-slate-700">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm_password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repeat your password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-100"
              {...register('confirm_password', {
                required: 'Please confirm your password',
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-semibold text-primary-600 hover:text-primary-500"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirm_password ? <p className="text-xs text-rose-500">{errors.confirm_password.message}</p> : null}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      <p className="text-center text-xs text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
          Sign in here
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
