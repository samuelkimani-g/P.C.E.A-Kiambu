import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/client';
import DataTable from '../../components/ui/DataTable';
import { formatCurrency, formatDate } from '../../utils/format';
import Badge from '../../components/ui/Badge';

const MemberFinancePage = () => {
  const [tithes, setTithes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMyTithes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/finance/tithes/my-tithes/');
      const payload = response.data?.data || response.data;
      setTithes(payload?.tithes || []);
      setTotal(payload?.total_tithes || 0);
    } catch (error) {
      toast.error('Unable to load your giving history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTithes();
  }, []);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 px-6 py-8 text-white shadow-card">
        <h1 className="text-2xl font-semibold">Thank you for your faithful giving</h1>
        <p className="mt-2 text-sm text-white/70">
          Track your tithe history and download statements for personal records.
        </p>
        <div className="mt-6 inline-flex items-center gap-4 rounded-2xl bg-white/15 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/70">Total tithes (all time)</p>
            <p className="text-3xl font-semibold text-white">{formatCurrency(total)}</p>
          </div>
          <Badge variant="accent" className="text-xs text-slate-900">KES</Badge>
        </div>
      </header>

      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Giving history</h2>
          <button type="button" className="btn-secondary text-xs font-semibold" onClick={() => toast('Statement generation coming soon!')}>
            Download statement
          </button>
        </div>
        <DataTable
          columns={[
            { Header: 'Date', accessor: 'date_given', Cell: (item) => formatDate(item.date_given) },
            { Header: 'Amount', accessor: 'amount', Cell: (item) => formatCurrency(item.amount) },
            { Header: 'Method', accessor: 'method' },
            {
              Header: 'Verified',
              accessor: 'is_verified',
              Cell: (item) => <Badge variant={item.is_verified ? 'success' : 'default'}>{item.is_verified ? 'Verified' : 'Pending'}</Badge>,
            },
          ]}
          data={tithes}
          emptyState={loading ? 'Loading your records...' : 'You have not recorded any tithes yet.'}
          dense
        />
      </section>
    </div>
  );
};

export default MemberFinancePage;
