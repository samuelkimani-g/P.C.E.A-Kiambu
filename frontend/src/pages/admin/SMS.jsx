import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import api from '../../api/client';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { formatDateTime } from '../../utils/format';

const SmsAdminPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: '',
      recipients: '',
    },
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sms/');
      const payload = response.data?.results || response.data?.data || response.data;
      setLogs(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (error) {
      toast.error('Unable to load SMS logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const onSendSms = async (values) => {
    try {
      const recipients = values.recipients
        .split(/\s|,|;|\n/)
        .map((item) => item.trim())
        .filter(Boolean);
      if (recipients.length === 0) {
        toast.error('Add at least one phone number');
        return;
      }
      await api.post('/sms/send/', { message: values.message, recipients });
      toast.success(`Message sent to ${recipients.length} recipient(s)`);
      reset({ message: '', recipients: '' });
      fetchLogs();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send SMS');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="SMS broadcasts"
        description="Send quick updates and reminders to the congregation."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <PaperAirplaneIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Compose message</h2>
              <p className="text-sm text-muted">Use comma or new lines to separate phone numbers.</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSendSms)}>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Message</label>
              <textarea
                rows={5}
                maxLength={480}
                placeholder="Service reminder: Join us this Sunday at 9am for worship."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                {...register('message', { required: 'Message is required' })}
              />
              <p className="text-right text-xs text-muted">{watch('message').length}/480</p>
              {errors.message ? <p className="text-xs text-rose-500">{errors.message.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Recipients</label>
              <textarea
                rows={4}
                placeholder="+254712345678, +254733445566"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                {...register('recipients', { required: 'Add at least one recipient' })}
              />
              {errors.recipients ? <p className="text-xs text-rose-500">{errors.recipients.message}</p> : null}
            </div>
            <button type="submit" className="btn-primary w-full">
              Send SMS broadcast
            </button>
          </form>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent SMS activity</h2>
          <DataTable
            columns={[
              {
                Header: 'Sender',
                accessor: 'sent_by',
                Cell: (item) => (
                  <div>
                    <p className="font-semibold text-slate-900">{item.sent_by || 'System'}</p>
                    <p className="text-xs text-muted">{item.sender}</p>
                  </div>
                ),
              },
              {
                Header: 'Recipients',
                accessor: 'recipients',
                Cell: (item) => (
                  <p className="line-clamp-2 text-xs text-muted">
                    {Array.isArray(item.recipients) ? item.recipients.join(', ') : item.recipients}
                  </p>
                ),
              },
              {
                Header: 'Sent at',
                accessor: 'sent_at',
                Cell: (item) => <span className="text-xs text-muted">{formatDateTime(item.sent_at)}</span>,
              },
              {
                Header: 'Status',
                accessor: 'status',
                Cell: (item) => <span className="text-xs font-semibold text-primary-600">{item.status}</span>,
              },
            ]}
            data={logs}
            emptyState={loading ? 'Loading messages...' : 'No SMS logs yet'}
            dense
          />
        </div>
      </div>
    </div>
  );
};

export default SmsAdminPage;
