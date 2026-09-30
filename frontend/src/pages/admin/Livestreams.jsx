import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { PlayCircleIcon } from '@heroicons/react/24/outline';
import api from '../../api/client';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/format';

const LivestreamsAdminPage = () => {
  const [streams, setStreams] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      url: '',
      start_time: '',
      is_live: false,
    },
  });

  const fetchStreams = async (status = filter) => {
    try {
      setLoading(true);
      let endpoint = '/livestream/';
      if (status === 'live') endpoint = '/livestream/now/';
      if (status === 'upcoming') endpoint = '/livestream/upcoming/';
      const response = await api.get(endpoint, { params: { ordering: '-start_time' } });
      const payload = response.data?.results || response.data?.data || response.data;
      setStreams(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (error) {
      toast.error('Unable to load livestreams');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const onCreateStream = async (values) => {
    try {
      await api.post('/livestream/', values);
      toast.success('Livestream scheduled');
      reset({ title: '', description: '', url: '', start_time: '', is_live: false });
      fetchStreams(filter);
    } catch (error) {
      toast.error('Failed to create livestream');
      console.error(error);
    }
  };

  const toggleLive = async (stream) => {
    try {
      await api.patch(`/livestream/${stream.id}/`, { is_live: !stream.is_live });
      toast.success(stream.is_live ? 'Stream ended' : 'Stream is now live');
      fetchStreams(filter);
    } catch (error) {
      toast.error('Could not update livestream status');
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
            <p className="text-xs text-muted">{item.description}</p>
          </div>
        ),
      },
      {
        Header: 'Start time',
        accessor: 'start_time',
        Cell: (item) => <span className="text-sm text-muted">{formatDateTime(item.start_time)}</span>,
      },
      {
        Header: 'Status',
        accessor: 'is_live',
        Cell: (item) => (
          <Badge variant={item.is_live ? 'success' : 'default'}>
            {item.is_live ? 'Live' : item.start_time && new Date(item.start_time) < new Date() ? 'Completed' : 'Scheduled'}
          </Badge>
        ),
      },
      {
        Header: 'Link',
        accessor: 'url',
        Cell: (item) => (
          <a className="text-xs font-semibold text-primary-600" href={item.url} target="_blank" rel="noreferrer">
            Open stream
          </a>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Livestream studio"
        description="Schedule and manage livestream broadcasts for services and events."
      />

      <div className="flex flex-wrap items-center gap-3">
        {['live', 'upcoming', 'all'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === status ? 'bg-primary-100 text-primary-700' : 'text-muted hover:text-primary-600'
            }`}
          >
            {status === 'live' ? 'Live now' : status === 'upcoming' ? 'Upcoming' : 'All streams'}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={streams}
        emptyState={loading ? 'Checking broadcasts...' : 'No streams found'}
        renderActions={(stream) => (
          <button
            type="button"
            onClick={() => toggleLive(stream)}
            className="rounded-lg px-3 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50"
          >
            {stream.is_live ? 'Mark completed' : 'Go live'}
          </button>
        )}
      />

      <div className="card space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
            <PlayCircleIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Schedule new stream</h2>
            <p className="text-sm text-muted">Share your Sunday services, weddings, and special events live.</p>
          </div>
        </div>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onCreateStream)}>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Title</label>
            <input
              type="text"
              placeholder="Sunday Worship Service"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title ? <p className="text-xs text-rose-500">{errors.title.message}</p> : null}
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of what will be streamed"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description ? <p className="text-xs text-rose-500">{errors.description.message}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Streaming URL</label>
            <input
              type="url"
              placeholder="https://youtube.com/live/..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
              {...register('url', { required: 'URL is required' })}
            />
            {errors.url ? <p className="text-xs text-rose-500">{errors.url.message}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Start time</label>
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
              {...register('start_time', { required: 'Start time is required' })}
            />
            {errors.start_time ? <p className="text-xs text-rose-500">{errors.start_time.message}</p> : null}
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" {...register('is_live')} />
              Start as live now
            </label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full">Schedule broadcast</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivestreamsAdminPage;
