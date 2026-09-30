import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/client';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const { register, handleSubmit, reset } = useForm();
  const passwordForm = useForm();

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
      });
    }
  }, [user, reset]);

  const onUpdateProfile = async (values) => {
    try {
      await updateProfile(values);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangePassword = async (values) => {
    try {
      if (values.new_password !== values.confirm_password) {
        toast.error('Passwords do not match');
        return;
      }
      await api.post('/auth/change-password/', {
        old_password: values.old_password,
        new_password: values.new_password,
      });
      toast.success('Password updated');
      passwordForm.reset({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to update password');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="My profile"
        description="Manage your personal information and contact details."
      />

      <form className="card grid gap-4 p-6 md:grid-cols-2" onSubmit={handleSubmit(onUpdateProfile)}>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">First name</label>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
            {...register('first_name')}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Last name</label>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
            {...register('last_name')}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
            {...register('email')}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Phone number</label>
          <input
            type="tel"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
            {...register('phone_number')}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Address</label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
            {...register('address')}
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn-primary">Save profile</button>
        </div>
      </form>

      <form className="card space-y-4 p-6" onSubmit={passwordForm.handleSubmit(onChangePassword)}>
        <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Current password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              {...passwordForm.register('old_password', { required: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">New password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              {...passwordForm.register('new_password', { required: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Confirm password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              {...passwordForm.register('confirm_password', { required: true })}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-secondary">Update password</button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
