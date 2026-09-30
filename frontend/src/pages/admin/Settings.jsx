import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';

const AdminSettingsPage = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      church_name: 'PCEA Church System',
      contact_email: 'info@pcea.org',
      contact_phone: '+254700000000',
      livestream_default_url: 'https://youtube.com/',
      enable_sms_notifications: true,
    },
  });

  const onSave = (values) => {
    console.table(values);
    toast.success('Settings saved (mock). Integrate with backend to persist.');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="System preferences"
        description="Configure contact details, communication defaults, and integrations."
      />
      <form className="card space-y-6 p-6" onSubmit={handleSubmit(onSave)}>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">General information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Church name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                {...register('church_name')}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Contact email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                {...register('contact_email')}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Contact phone</label>
              <input
                type="tel"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                {...register('contact_phone')}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Default livestream link</label>
              <input
                type="url"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                {...register('livestream_default_url')}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Communication</h2>
          <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              {...register('enable_sms_notifications')}
            />
            Enable SMS notifications by default for urgent announcements
          </label>
          <p className="text-xs text-muted">
            Tip: Integrate the toggle with Africa’s Talking or Twilio when SMS automation is ready.
          </p>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">Save settings</button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
