import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/client';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/format';

const MemberLivestreamsPage = () => {
  const [liveStreams, setLiveStreams] = useState([]);
  const [upcomingStreams, setUpcomingStreams] = useState([]);

  const fetchStreams = async () => {
    try {
      const [liveRes, upcomingRes] = await Promise.all([
        api.get('/livestream/now/'),
        api.get('/livestream/upcoming/'),
      ]);
      const livePayload = liveRes.data?.results || liveRes.data?.data || liveRes.data;
      const upcomingPayload = upcomingRes.data?.results || upcomingRes.data?.data || upcomingRes.data;
      setLiveStreams(Array.isArray(livePayload) ? livePayload : livePayload.results || []);
      setUpcomingStreams(Array.isArray(upcomingPayload) ? upcomingPayload : upcomingPayload.results || []);
    } catch (error) {
      toast.error('Unable to load livestreams');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  return (
    <div className="space-y-8">
      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Live now</h1>
          <Badge variant="success">Live</Badge>
        </div>
        {liveStreams.length === 0 ? (
          <p className="text-sm text-muted">No livestream currently running. Check the upcoming schedule below.</p>
        ) : (
          liveStreams.map((stream) => (
            <article key={stream.id} className="rounded-2xl border border-primary-200 bg-primary-50/70 px-4 py-3">
              <h2 className="text-base font-semibold text-primary-900">{stream.title}</h2>
              <p className="text-sm text-primary-700/80">{stream.description}</p>
              <a
                href={stream.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center text-sm font-semibold text-primary-700"
              >
                Join livestream
              </a>
            </article>
          ))
        )}
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Upcoming streams</h2>
        {upcomingStreams.length === 0 ? (
          <p className="text-sm text-muted">No upcoming streams have been published yet.</p>
        ) : (
          <ul className="space-y-3">
            {upcomingStreams.map((stream) => (
              <li key={stream.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{stream.title}</p>
                    <p className="text-xs text-muted">{stream.description}</p>
                  </div>
                  <Badge>{formatDateTime(stream.start_time)}</Badge>
                </div>
                <a
                  className="mt-2 inline-flex items-center text-xs font-semibold text-primary-600"
                  href={stream.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View details
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default MemberLivestreamsPage;
