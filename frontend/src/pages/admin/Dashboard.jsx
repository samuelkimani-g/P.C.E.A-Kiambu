import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencyDollarIcon, MegaphoneIcon, PlayCircleIcon, UsersIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../api/client';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/ui/DataTable';
import { formatCurrency, formatDateTime } from '../../utils/format';

const DEFAULT_FINANCE = {
  tithes_total: '0',
  offerings_total: '0',
  monthly: [],
  by_method: {},
  top_members: [],
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({
    members: 0,
    announcements: 0,
    livestreams: 0,
    finance: DEFAULT_FINANCE,
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(false);

      const requests = [
        { key: 'members', promise: api.get('/members/?page=1') },
        { key: 'announcements', promise: api.get('/announcements/?page=1') },
        { key: 'livestreams', promise: api.get('/livestream/upcoming/?page=1') },
        { key: 'events', promise: api.get('/events/?page=1') },
        { key: 'finance', promise: api.get('/finance/reports/summary/') },
      ];

      const settled = await Promise.allSettled(requests.map((req) => req.promise));

      const results = {};
      let failureCount = 0;

      settled.forEach((result, index) => {
        const key = requests[index].key;
        if (result.status === 'fulfilled') {
          results[key] = result.value.data;
        } else {
          failureCount += 1;
          if (key !== 'finance') {
            console.error(`Failed to fetch ${key}`, result.reason);
            toast.error(`Unable to load ${key}`);
          }
          if (key === 'finance') {
            results[key] = DEFAULT_FINANCE;
          }
        }
      });

      if (failureCount === requests.length) {
        setError(true);
        setLoading(false);
        return;
      }

      const membersData = results.members?.results || results.members?.data || results.members || [];
      const announcementData = results.announcements?.results || results.announcements?.data || results.announcements || [];
      const livestreamData = results.livestreams?.results || results.livestreams?.data || results.livestreams || [];
      const eventsData = results.events?.results || results.events?.data || results.events || [];
      const financeData = results.finance?.data || results.finance || DEFAULT_FINANCE;

      setStats({
        members: Array.isArray(membersData) ? membersData.length : membersData.count || 0,
        announcements: Array.isArray(announcementData) ? announcementData.length : announcementData.count || 0,
        livestreams: Array.isArray(livestreamData) ? livestreamData.length : livestreamData.count || 0,
        finance: {
          tithes_total: financeData?.tithes_total || '0',
          offerings_total: financeData?.offerings_total || '0',
          monthly: financeData?.monthly || [],
          by_method: financeData?.by_method || {},
          top_members: financeData?.top_members || [],
        },
      });

      setRecentAnnouncements(Array.isArray(announcementData) ? announcementData.slice(0, 5) : announcementData.results?.slice(0, 5) || []);
      setUpcomingEvents(Array.isArray(eventsData) ? eventsData.slice(0, 5) : eventsData.results?.slice(0, 5) || []);

      setLoading(false);
    };

    fetchDashboard();
  }, []);

  const givingSeries = useMemo(() => {
    const monthly = stats.finance.monthly || [];
    if (monthly.length === 0) {
      return [
        { month: 'Jan', tithes: 0, offerings: 0 },
        { month: 'Feb', tithes: 0, offerings: 0 },
        { month: 'Mar', tithes: 0, offerings: 0 },
      ];
    }
    return monthly.map((item) => ({
      month: item.month || item.label,
      tithes: Number(item.tithes || item.tithes_total || 0),
      offerings: Number(item.offerings || item.offerings_total || 0),
    }));
  }, [stats.finance.monthly]);

  if (loading) {
    return <LoadingScreen fullscreen label="Gathering insights..." />;
  }

  if (error) {
    return <ErrorState title="Unable to load dashboard" message="Check your connection and try again." onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Good to see you again"
        description="Overview of the church’s ministry health and latest activity."
        actions={
          <div className="flex items-center gap-3">
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/finance')}>
              View finance
            </button>
            <button type="button" className="btn-primary" onClick={() => navigate('/admin/announcements')}>
              New announcement
            </button>
          </div>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Members"
          value={stats.members}
          icon={UsersIcon}
          trend={4.8}
          trendLabel="growth this quarter"
        />
        <StatCard
          title="Tithes (30 days)"
          value={formatCurrency(stats.finance.tithes_total || 0)}
          icon={CurrencyDollarIcon}
          trend={8.2}
          trendLabel="vs last month"
          accent="emerald"
        />
        <StatCard
          title="Announcements"
          value={stats.announcements}
          icon={MegaphoneIcon}
          trend={-2.1}
          trendLabel="vs last month"
        />
        <StatCard
          title="Upcoming Streams"
          value={stats.livestreams}
          icon={PlayCircleIcon}
          trend={3.4}
          trendLabel="prepared"
          accent="accent"
        />
      </section>

      <section className="card grid gap-4 p-6 lg:grid-cols-4">
        <div className="lg:col-span-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
          <p className="text-sm text-muted">Jump straight into the most common admin tasks.</p>
        </div>
        <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-4">
          <button type="button" onClick={() => navigate('/admin/livestreams')} className="card group flex h-full flex-col items-start gap-2 p-5 text-left">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">Broadcast</span>
            <span className="text-base font-semibold text-slate-900">Create livestream</span>
            <span className="text-sm text-muted">Schedule or start a live service stream</span>
            <span className="mt-auto text-xs font-semibold text-primary-600 group-hover:text-primary-700">Manage livestreams →</span>
          </button>
          <button type="button" onClick={() => navigate('/admin/events')} className="card group flex h-full flex-col items-start gap-2 p-5 text-left">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Gather</span>
            <span className="text-base font-semibold text-slate-900">Plan event</span>
            <span className="text-sm text-muted">Set dates and track attendance for ministry events</span>
            <span className="mt-auto text-xs font-semibold text-primary-600 group-hover:text-primary-700">Manage events →</span>
          </button>
          <button type="button" onClick={() => navigate('/admin/finance')} className="card group flex h-full flex-col items-start gap-2 p-5 text-left">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Finance</span>
            <span className="text-base font-semibold text-slate-900">Review giving</span>
            <span className="text-sm text-muted">Verify tithes and offerings, export summaries</span>
            <span className="mt-auto text-xs font-semibold text-primary-600 group-hover:text-primary-700">Finance dashboard →</span>
          </button>
          <button type="button" onClick={() => navigate('/admin/hymns')} className="card group flex h-full flex-col items-start gap-2 p-5 text-left">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Worship</span>
            <span className="text-base font-semibold text-slate-900">Add hymn</span>
            <span className="text-sm text-muted">Keep the congregation songbook updated</span>
            <span className="mt-auto text-xs font-semibold text-primary-600 group-hover:text-primary-700">Manage hymns →</span>
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card col-span-2 h-[360px] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Giving trends</h2>
              <p className="text-sm text-muted">Monthly summary of tithes and offerings</p>
            </div>
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">KES</span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={givingSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTithes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#603ce6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#603ce6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOfferings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="tithes" stroke="#603ce6" fillOpacity={1} fill="url(#colorTithes)" />
                <Area type="monotone" dataKey="offerings" stroke="#fbbf24" fillOpacity={1} fill="url(#colorOfferings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex flex-col gap-4 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming events</h2>
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted">No events scheduled yet.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-muted">{formatDateTime(event.event_date)}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-primary-600">{event.location}</p>
                </div>
              ))
            )}
          </div>
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/events')}>
            View all events
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent announcements</h2>
          <DataTable
            columns={[
              {
                Header: 'Announcement',
                accessor: 'title',
                Cell: (item) => (
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{item.message}</p>
                  </div>
                ),
              },
              {
                Header: 'Created',
                accessor: 'created_at',
                Cell: (item) => <span>{formatDateTime(item.created_at)}</span>,
              },
              {
                Header: 'Urgent',
                accessor: 'is_urgent',
                Cell: (item) => (
                  <span className={`text-xs font-semibold ${item.is_urgent ? 'text-rose-600' : 'text-muted'}`}>
                    {item.is_urgent ? 'Urgent' : 'Normal'}
                  </span>
                ),
              },
            ]}
            data={recentAnnouncements}
            emptyState="No announcements yet"
            dense
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Livestream readiness</h2>
          <div className="card space-y-5 p-6">
            <p className="text-sm text-muted">
              {stats.livestreams > 0
                ? 'Your upcoming streams are scheduled and ready. Remember to share the links with members.'
                : 'No upcoming livestreams found. Consider scheduling your next service broadcast.'}
            </p>
            <button type="button" className="btn-primary w-full" onClick={() => navigate('/admin/livestreams')}>
              Schedule livestream
            </button>
            <button type="button" className="btn-secondary w-full" onClick={() => navigate('/admin/sms')}>
              Share via SMS
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
