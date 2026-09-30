import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { MegaphoneIcon } from '@heroicons/react/24/solid';
import api from '../../api/client';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { ANNOUNCEMENT_CATEGORIES } from '../../utils/constants';
import { formatDateTime } from '../../utils/format';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState({ category: '', urgent: false });
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      message: '',
      category: 'general',
      is_urgent: false,
    },
  });

  const fetchAnnouncements = async (query = {}) => {
    try {
      setLoading(true);
      const endpoint = query.urgent ? '/announcements/urgent/' : '/announcements/';
      const response = await api.get(endpoint, {
        params: {
          category: query.category || undefined,
          page: 1,
          ordering: '-created_at',
        },
      });
      const payload = response.data?.results || response.data?.data || response.data;
      setAnnouncements(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (error) {
      toast.error('Unable to load announcements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateAnnouncement = async (values) => {
    try {
      await api.post('/announcements/', values);
      toast.success('Announcement published');
      reset({ title: '', message: '', category: values.category, is_urgent: false });
      fetchAnnouncements(filter);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to publish announcement');
      console.error(error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        Cell: (item) => (
          <div>
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{item.message}</p>
          </div>
        ),
      },
      {
        Header: 'Category',
        accessor: 'category',
        Cell: (item) => <Badge>{item.category}</Badge>,
      },
      {
        Header: 'Urgent',
        accessor: 'is_urgent',
        Cell: (item) => (
          <Badge variant={item.is_urgent ? 'danger' : 'default'}>
            {item.is_urgent ? 'Urgent' : 'Normal'}
          </Badge>
        ),
      },
      {
        Header: 'Published',
        accessor: 'created_at',
        Cell: (item) => <span className="text-sm text-muted">{formatDateTime(item.created_at)}</span>,
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Church announcements"
        description="Share updates with the congregation across ministries and districts."
      />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent announcements</h2>
            <div className="flex items-center gap-3 text-sm">
              <label className="inline-flex items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  checked={filter.urgent}
                  onChange={(event) => {
                    const urgent = event.target.checked;
                    setFilter((prev) => ({ ...prev, urgent }));
                    fetchAnnouncements({ ...filter, urgent });
                  }}
                />
                Urgent only
              </label>
              <select
                value={filter.category}
                onChange={(event) => {
                  const category = event.target.value;
                  setFilter((prev) => ({ ...prev, category }));
                  fetchAnnouncements({ ...filter, category });
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              >
                <option value="">All categories</option>
                {ANNOUNCEMENT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={announcements}
            emptyState={loading ? 'Loading announcements...' : 'No announcements yet'}
            dense
          />
        </div>

        <div className="card space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <MegaphoneIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Publish announcement</h2>
              <p className="text-sm text-muted">Inform members about services, outreach, and ministry updates.</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onCreateAnnouncement)}>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Title</label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                placeholder="Youth worship concert"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title ? <p className="text-xs text-rose-500">{errors.title.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Message</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                placeholder="Share the update with full details..."
                {...register('message', { required: 'Message is required' })}
              />
              {errors.message ? <p className="text-xs text-rose-500">{errors.message.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Category</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                {...register('category')}
              >
                {ANNOUNCEMENT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                {...register('is_urgent')}
              />
              Mark as urgent
            </label>
            <button type="submit" className="btn-primary w-full">
              Publish announcement
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AnnouncementsPage;
