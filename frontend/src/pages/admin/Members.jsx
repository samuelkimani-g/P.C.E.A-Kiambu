import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import api from '../../api/client';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { MEMBERSHIP_STATUSES, DISTRICTS } from '../../utils/constants';
import { formatDate } from '../../utils/format';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({ search: '', membership_status: '', district: '' });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMember, setActiveMember] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchMembers = async (query = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/members/', { params: { ...query, page: 1 } });
      const payload = response.data?.results || response.data?.data || response.data;
      setMembers(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (error) {
      toast.error('Unable to load members');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = (event) => {
    event.preventDefault();
    fetchMembers(filters);
  };

  const openEditModal = (member) => {
    setActiveMember(member);
    reset({
      phone: member.phone,
      email: member.email,
      address: member.address,
      district: member.district || '',
      membership_status: member.membership_status,
    });
    setModalOpen(true);
  };

  const onUpdateMember = async (values) => {
    try {
      await api.patch(`/members/${activeMember.id}/`, values);
      toast.success('Member updated');
      setModalOpen(false);
      fetchMembers(filters);
    } catch (error) {
      toast.error('Failed to update member');
      console.error(error);
    }
  };

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'full_name' },
      { Header: 'District', accessor: 'district', Cell: (item) => item.district || '—' },
      { Header: 'Phone', accessor: 'phone' },
      { Header: 'Email', accessor: 'email' },
      {
        Header: 'Status',
        accessor: 'membership_status',
        Cell: (item) => (
          <Badge variant={item.membership_status === 'active' ? 'success' : 'default'}>
            {item.membership_status.replace(/\b\w/g, (char) => char.toUpperCase())}
          </Badge>
        ),
      },
      {
        Header: 'Joined',
        accessor: 'joined_on',
        Cell: (item) => <span>{formatDate(item.joined_on)}</span>,
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Member records"
        description="Keep member information up to date and accurate."
        actions={
          <button type="button" className="btn-primary" onClick={() => toast('Use the register form to onboard new members.')}>New member</button>
        }
      />

      <form onSubmit={onFilter} className="card grid gap-4 p-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Search</label>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-muted" />
            <input
              type="search"
              placeholder="Search by name or phone"
              className="w-full border-0 bg-transparent text-sm focus:outline-none"
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Membership status</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
            value={filters.membership_status}
            onChange={(event) => setFilters((prev) => ({ ...prev, membership_status: event.target.value }))}
          >
            <option value="">All</option>
            {MEMBERSHIP_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">District</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
            value={filters.district}
            onChange={(event) => setFilters((prev) => ({ ...prev, district: event.target.value }))}
          >
            <option value="">All</option>
            {DISTRICTS.map((district) => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full">
            Filter results
          </button>
        </div>
      </form>

      <DataTable
        columns={columns}
        data={members}
        emptyState={loading ? 'Loading members...' : 'No members found'}
        renderActions={(member) => (
          <button
            type="button"
            onClick={() => openEditModal(member)}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50"
          >
            <PencilSquareIcon className="h-4 w-4" /> Edit
          </button>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Update ${activeMember?.full_name}`}
        description="Adjust contact details or membership status."
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="member-update" className="btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <form id="member-update" className="space-y-4" onSubmit={handleSubmit(onUpdateMember)}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Phone</label>
            <input
              type="tel"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
              {...register('phone')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
              {...register('email')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Address</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
              {...register('address')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">District</label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
              {...register('district')}
            >
              <option value="">Select district</option>
              {DISTRICTS.map((district) => (
                <option key={district.value} value={district.value}>
                  {district.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Membership status</label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
              {...register('membership_status')}
            >
              {MEMBERSHIP_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MembersPage;
