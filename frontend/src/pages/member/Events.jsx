import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/client';
import Badge from '../../components/ui/Badge';
import { ATTENDANCE_STATUSES } from '../../utils/constants';
import { formatDateTime } from '../../utils/format';

const MemberEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('present');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/?page=1');
      const payload = response.data?.results || response.data?.data || response.data;
      setEvents(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (error) {
      toast.error('Unable to load events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const markAttendance = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/mark-attendance/`, { status: selectedStatus });
      toast.success('Your attendance has been recorded');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update attendance');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Upcoming events & meetings</h1>
          <p className="text-sm text-muted">Let your ministry leaders know if you will be present.</p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-muted">
          <span>Mark status as</span>
          <select
            className="rounded-full border border-slate-200 px-3 py-1 text-xs focus:border-primary-500 focus:outline-none"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
          >
            {ATTENDANCE_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <p className="text-sm text-muted">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted">No events have been scheduled yet.</p>
        ) : (
          events.map((event) => (
            <article key={event.id} className="card space-y-3 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{event.title}</h2>
                  <p className="text-sm text-muted">{event.description}</p>
                </div>
                <Badge>{formatDateTime(event.event_date)}</Badge>
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary-600">{event.location}</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-primary" onClick={() => markAttendance(event.id)}>
                  Mark attendance
                </button>
                <button type="button" className="btn-secondary" onClick={() => toast('Coming soon: add to calendar')}>
                  Add to calendar
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default MemberEventsPage;
