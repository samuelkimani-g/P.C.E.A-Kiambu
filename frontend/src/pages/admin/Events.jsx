import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import api from '../../api/client';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { ATTENDANCE_STATUSES } from '../../utils/constants';
import { formatDateTime } from '../../utils/format';

const EventsAdminPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      event_date: '',
      location: '',
    },
  });
  const attendanceForm = useForm({
    defaultValues: {
      member_id: '',
      status: 'present',
      notes: '',
    },
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/', { params: { ordering: '-event_date' } });
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

  const createEvent = async (values) => {
    try {
      await api.post('/events/', values);
      toast.success('Event created');
      reset({ title: '', description: '', event_date: '', location: '' });
      fetchEvents();
    } catch (error) {
      toast.error('Failed to create event');
      console.error(error);
    }
  };

  const openAttendanceModal = async (event) => {
    setActiveEvent(event);
    attendanceForm.reset({ member_id: '', status: 'present', notes: '' });
    try {
      const response = await api.get(`/events/${event.id}/attendance/`);
      const payload = response.data?.attendances || response.data?.data?.attendances || response.data?.data || response.data;
      setAttendance(Array.isArray(payload) ? payload : payload?.attendances || []);
    } catch (error) {
      toast.error('Unable to load attendance');
      console.error(error);
      setAttendance([]);
    }
    setModalOpen(true);
  };

  const markAttendance = async (values) => {
    if (!activeEvent) return;
    try {
      await api.post(`/events/${activeEvent.id}/mark-attendance/`, {
        member_id: values.member_id,
        status: values.status,
        notes: values.notes,
      });
      toast.success('Attendance recorded');
      attendanceForm.reset({ member_id: '', status: values.status, notes: '' });
      const response = await api.get(`/events/${activeEvent.id}/attendance/`);
      const payload = response.data?.attendances || response.data?.data?.attendances || response.data;
      setAttendance(Array.isArray(payload) ? payload : payload?.attendances || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to mark attendance');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Events & gatherings"
        description="Plan services and track participation across ministries."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming & recent events</h2>
          <DataTable
            columns={[
              {
                Header: 'Event',
                accessor: 'title',
                Cell: (item) => (
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-muted">{item.description}</p>
                  </div>
                ),
              },
              {
                Header: 'Date',
                accessor: 'event_date',
                Cell: (item) => <span className="text-sm text-muted">{formatDateTime(item.event_date)}</span>,
              },
              {
                Header: 'Location',
                accessor: 'location',
              },
              {
                Header: 'Created by',
                accessor: 'created_by',
                Cell: (item) => item.created_by?.username || '—',
              },
            ]}
            data={events}
            emptyState={loading ? 'Loading events...' : 'No events yet'}
            renderActions={(event) => (
              <button
                type="button"
                onClick={() => openAttendanceModal(event)}
                className="rounded-lg px-3 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50"
              >
                Attendance
              </button>
            )}
          />
        </div>

        <div className="card space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <CalendarDaysIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create new event</h2>
              <p className="text-sm text-muted">Schedule services, meetings, and special programs.</p>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(createEvent)}>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Title</label>
              <input
                type="text"
                placeholder="Holy Communion Service"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                {...register('title', { required: 'Event title is required' })}
              />
              {errors.title ? <p className="text-xs text-rose-500">{errors.title.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Description</label>
              <textarea
                rows={3}
                placeholder="Briefly describe what will happen"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description ? <p className="text-xs text-rose-500">{errors.description.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Date & time</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                {...register('event_date', { required: 'Date is required' })}
              />
              {errors.event_date ? <p className="text-xs text-rose-500">{errors.event_date.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Location</label>
              <input
                type="text"
                placeholder="Sanctuary / Youth Hall"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                {...register('location', { required: 'Location is required' })}
              />
              {errors.location ? <p className="text-xs text-rose-500">{errors.location.message}</p> : null}
            </div>
            <button type="submit" className="btn-primary w-full">
              Save event
            </button>
          </form>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Attendance • ${activeEvent?.title || ''}`}
        description="Record attendance and review participation."
        footer={
          <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
            Close
          </button>
        }
      >
        <section className="space-y-4 text-sm">
          <div className="grid gap-3 rounded-2xl bg-slate-50/70 px-4 py-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted">Event date</p>
              <p className="font-semibold text-slate-900">{formatDateTime(activeEvent?.event_date)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Location</p>
              <p className="font-semibold text-slate-900">{activeEvent?.location}</p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={attendanceForm.handleSubmit(markAttendance)}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Member ID</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                  {...attendanceForm.register('member_id', { required: 'Member ID is required' })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Status</label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                  {...attendanceForm.register('status')}
                >
                  {ATTENDANCE_STATUSES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Notes</label>
              <textarea
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                {...attendanceForm.register('notes')}
              />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Record attendance
            </button>
          </form>

          <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-muted">Member</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted">Status</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted">Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-center text-muted">
                      No attendance recorded yet.
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr key={`${record.event}-${record.member}-${record.timestamp}`}>
                      <td className="px-3 py-2 font-semibold text-slate-800">{record.member?.full_name || record.member_name || record.member}</td>
                      <td className="px-3 py-2">
                        <Badge variant={record.status === 'present' ? 'success' : record.status === 'excused' ? 'info' : 'default'}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-muted">{formatDateTime(record.timestamp)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </Modal>
    </div>
  );
};

export default EventsAdminPage;
