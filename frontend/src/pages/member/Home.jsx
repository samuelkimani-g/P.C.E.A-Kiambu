import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/client';
import DataTable from '../../components/ui/DataTable';
import { formatDateTime } from '../../utils/format';
import Badge from '../../components/ui/Badge';

const MemberHomePage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [livestreams, setLivestreams] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [annRes, liveRes, eventRes] = await Promise.all([
          api.get('/announcements/?page=1'),
          api.get('/livestream/upcoming/?page=1'),
          api.get('/events/?page=1'),
        ]);
        const annData = annRes.data?.results || annRes.data?.data || annRes.data;
        setAnnouncements(Array.isArray(annData) ? annData.slice(0, 4) : annData.results?.slice(0, 4) || []);
        const liveData = liveRes.data?.results || liveRes.data?.data || liveRes.data;
        setLivestreams(Array.isArray(liveData) ? liveData.slice(0, 2) : liveData.results?.slice(0, 2) || []);
        const eventData = eventRes.data?.results || eventRes.data?.data || eventRes.data;
        setEvents(Array.isArray(eventData) ? eventData.slice(0, 4) : eventData.results?.slice(0, 4) || []);
      } catch (error) {
        toast.error('Unable to load home feed');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 px-8 py-10 text-white shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">PCEA Community</p>
        <h1 className="mt-4 text-3xl font-semibold">Grace and peace be with you this week</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          Stay connected to announcements, worship resources, and gatherings for your family and ministry groups.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Latest announcements</h2>
          <DataTable
            columns={[
              {
                Header: 'Announcement',
                accessor: 'title',
                Cell: (item) => (
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-muted">{item.message}</p>
                  </div>
                ),
              },
              {
                Header: 'When',
                accessor: 'created_at',
                Cell: (item) => <span className="text-xs text-muted">{formatDateTime(item.created_at)}</span>,
              },
              {
                Header: 'Tag',
                accessor: 'category',
                Cell: (item) => <Badge>{item.category}</Badge>,
              },
            ]}
            data={announcements}
            emptyState={loading ? 'Loading announcements...' : 'No announcements yet'}
            dense
          />
        </div>

        <div className="space-y-4">
          <div className="card space-y-3 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming livestream</h2>
            {livestreams.length === 0 ? (
              <p className="text-sm text-muted">No scheduled livestreams yet. Check back soon.</p>
            ) : (
              livestreams.map((stream) => (
                <div key={stream.id} className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{stream.title}</p>
                  <p className="text-xs text-muted">{formatDateTime(stream.start_time)}</p>
                  <a
                    className="mt-2 inline-flex items-center text-xs font-semibold text-primary-600"
                    href={stream.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join stream
                  </a>
                </div>
              ))
            )}
          </div>

          <div className="card space-y-3 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Featured events</h2>
            <ul className="space-y-3">
              {events.length === 0 ? (
                <li className="text-sm text-muted">No upcoming events found.</li>
              ) : (
                events.map((event) => (
                  <li key={event.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                    <p className="text-xs text-muted">{formatDateTime(event.event_date)}</p>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary-600">{event.location}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberHomePage;
