import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import api from '../../api/client';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/format';
import { PAYMENT_METHODS, OFFERING_TYPES } from '../../utils/constants';

const tabOptions = [
  { value: 'tithes', label: 'Tithes' },
  { value: 'offerings', label: 'Offerings' },
  { value: 'summary', label: 'Reports' },
];

const FinanceAdminPage = () => {
  const [activeTab, setActiveTab] = useState('tithes');
  const [tithes, setTithes] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [membersLookup, setMembersLookup] = useState([]);
  const [loading, setLoading] = useState(false);

  const reportForm = useForm({
    defaultValues: {
      from: '',
      to: '',
    },
  });
  const titheForm = useForm({
    defaultValues: {
      member: '',
      amount: '',
      date_given: '',
      method: 'cash',
      reference_number: '',
    },
  });
  const offeringForm = useForm({
    defaultValues: {
      offering_type: 'general',
      amount: '',
      date_given: '',
      method: 'cash',
      reference_number: '',
    },
  });

  const { register: registerReport, handleSubmit: handleReportSubmit } = reportForm;
  const { register: registerTithe, handleSubmit: handleTitheSubmit, reset: resetTitheForm } = titheForm;
  const { register: registerOffering, handleSubmit: handleOfferingSubmit, reset: resetOfferingForm } = offeringForm;

  const fetchTithes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/finance/tithes/');
      const payload = response.data?.results || response.data?.data || response.data;
      setTithes(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (error) {
      toast.error('Unable to load tithes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/finance/offerings/');
      const payload = response.data?.results || response.data?.data || response.data;
      setOfferings(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (error) {
      toast.error('Unable to load offerings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async (params) => {
    try {
      setLoading(true);
      const response = await api.get('/finance/reports/summary/', { params });
      setSummary(response.data?.data || response.data || {});
    } catch (error) {
      toast.error('Unable to generate report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersLookup = async () => {
    try {
      const response = await api.get('/members/', { params: { page_size: 1000 } });
      const payload = response.data?.results || response.data?.data || response.data;
      const list = Array.isArray(payload) ? payload : payload?.results || [];
      setMembersLookup(list.map((member) => ({ id: member.id, label: member.full_name, district: member.district })));
    } catch (error) {
      console.error('Unable to load members for lookup', error);
    }
  };

  useEffect(() => {
    fetchTithes();
    fetchOfferings();
    fetchSummary({});
    fetchMembersLookup();
  }, []);

  const verifyRecord = async (type, record) => {
    try {
      const endpoint = type === 'tithe' ? `/finance/tithes/${record.id}/` : `/finance/offerings/${record.id}/`;
      await api.patch(endpoint, { is_verified: !record.is_verified });
      toast.success(record.is_verified ? 'Verification removed' : 'Payment verified');
      if (type === 'tithe') fetchTithes();
      if (type === 'offering') fetchOfferings();
      fetchSummary({});
    } catch (error) {
      toast.error('Unable to update verification');
      console.error(error);
    }
  };

  const onCreateTithe = async (values) => {
    try {
      const payload = {
        member: values.member || null,
        amount: Number(values.amount),
        date_given: values.date_given,
        method: values.method,
        reference_number: values.reference_number || undefined,
      };
      if (!payload.member) {
        delete payload.member;
      }
      await api.post('/finance/tithes/', payload);
      toast.success('Tithe recorded');
      resetTitheForm();
      fetchTithes();
      fetchSummary({});
    } catch (error) {
      toast.error('Unable to save tithe');
      console.error(error);
    }
  };

  const onCreateOffering = async (values) => {
    try {
      const payload = {
        offering_type: values.offering_type,
        amount: Number(values.amount),
        date_given: values.date_given,
        method: values.method,
        reference_number: values.reference_number || undefined,
      };
      await api.post('/finance/offerings/', payload);
      toast.success('Offering recorded');
      resetOfferingForm();
      fetchOfferings();
      fetchSummary({});
    } catch (error) {
      toast.error('Unable to save offering');
      console.error(error);
    }
  };

  const titheColumns = useMemo(
    () => [
      { Header: 'Member', accessor: 'member_name', Cell: (item) => item.member?.full_name || item.member_name || '—' },
      { Header: 'Amount', accessor: 'amount', Cell: (item) => formatCurrency(item.amount) },
      { Header: 'Date given', accessor: 'date_given', Cell: (item) => formatDate(item.date_given) },
      { Header: 'Method', accessor: 'method' },
      {
        Header: 'Status',
        accessor: 'is_verified',
        Cell: (item) => <Badge variant={item.is_verified ? 'success' : 'default'}>{item.is_verified ? 'Verified' : 'Pending'}</Badge>,
      },
    ],
    [],
  );

  const offeringColumns = useMemo(
    () => [
      { Header: 'Type', accessor: 'offering_type' },
      { Header: 'Amount', accessor: 'amount', Cell: (item) => formatCurrency(item.amount) },
      { Header: 'Date', accessor: 'date_given', Cell: (item) => formatDate(item.date_given) },
      { Header: 'Method', accessor: 'method' },
      {
        Header: 'Status',
        accessor: 'is_verified',
        Cell: (item) => <Badge variant={item.is_verified ? 'success' : 'default'}>{item.is_verified ? 'Verified' : 'Pending'}</Badge>,
      },
    ],
    [],
  );

  const onGenerateReport = (values) => {
    fetchSummary({ from: values.from || undefined, to: values.to || undefined });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Finance stewardship"
        description="Review giving trends, verify submissions, and export financial summaries."
        actions={<button type="button" className="btn-secondary">Export CSV</button>}
      />

      <Tabs tabs={tabOptions} current={activeTab} onChange={setActiveTab} />

      {activeTab === 'tithes' && (
        <div className="space-y-4">
          <div className="card space-y-3 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CurrencyDollarIcon className="h-6 w-6 text-primary-600" /> Record tithe
            </h2>
            <p className="text-sm text-muted">Amounts are private to the finance team. Members no longer see their personal statements.</p>
            <form className="grid gap-4 md:grid-cols-4" onSubmit={handleTitheSubmit(onCreateTithe)}>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Member</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerTithe('member', { required: 'Select the member giving this tithe.' })}
                >
                  <option value="">Select member</option>
                  {membersLookup.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.label}{member.district ? ` • ${member.district}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerTithe('amount', { required: 'Amount is required.' })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Date given</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerTithe('date_given', { required: 'Date is required.' })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Method</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerTithe('method')}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Reference (optional)</label>
                <input
                  type="text"
                  placeholder="Transaction reference"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerTithe('reference_number')}
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button type="submit" className="btn-primary">Save tithe</button>
              </div>
            </form>
          </div>
          <DataTable
            columns={titheColumns}
            data={tithes}
            emptyState={loading ? 'Loading tithes...' : 'No tithes recorded'}
            renderActions={(item) => (
              <button
                type="button"
                onClick={() => verifyRecord('tithe', item)}
                className="rounded-lg px-3 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50"
              >
                {item.is_verified ? 'Unverify' : 'Verify'}
              </button>
            )}
          />
        </div>
      )}

      {activeTab === 'offerings' && (
        <div className="space-y-4">
          <div className="card space-y-3 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CurrencyDollarIcon className="h-6 w-6 text-primary-600" /> Record offering
            </h2>
            <p className="text-sm text-muted">Capture collective offerings from services or special initiatives.</p>
            <form className="grid gap-4 md:grid-cols-4" onSubmit={handleOfferingSubmit(onCreateOffering)}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Offering type</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerOffering('offering_type', { required: true })}
                >
                  {OFFERING_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerOffering('amount', { required: 'Amount is required.' })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Date received</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerOffering('date_given', { required: 'Date is required.' })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Method</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerOffering('method')}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Reference (optional)</label>
                <input
                  type="text"
                  placeholder="Receipt or transaction reference"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerOffering('reference_number')}
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button type="submit" className="btn-primary">Save offering</button>
              </div>
            </form>
          </div>
          <DataTable
            columns={offeringColumns}
            data={offerings}
            emptyState={loading ? 'Loading offerings...' : 'No offerings recorded'}
            renderActions={(item) => (
              <button
                type="button"
                onClick={() => verifyRecord('offering', item)}
                className="rounded-lg px-3 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50"
              >
                {item.is_verified ? 'Unverify' : 'Verify'}
              </button>
            )}
          />
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <form className="card space-y-4 p-6" onSubmit={handleReportSubmit(onGenerateReport)}>
            <h2 className="text-lg font-semibold text-slate-900">Generate custom report</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">From</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerReport('from')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">To</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...registerReport('to')}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">Generate summary</button>
          </form>

          <div className="card space-y-4 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Giving summary</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Total Tithes</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(summary?.tithes_total || 0)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Total Offerings</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(summary?.offerings_total || 0)}</p>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted">By method</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(summary?.by_method || {}).map(([method, amount]) => (
                  <div key={method} className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm">
                    <p className="font-semibold text-slate-800">{method}</p>
                    <p className="text-muted">{formatCurrency(amount)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted">Top givers</h3>
              <ul className="divide-y divide-slate-100 text-sm">
                {(summary?.top_members || []).map((item) => (
                  <li key={item.member} className="flex items-center justify-between py-2">
                    <span>{item.member}</span>
                    <span className="font-semibold text-primary-600">{formatCurrency(item.amount)}</span>
                  </li>
                ))}
                {(!summary?.top_members || summary.top_members.length === 0) && (
                  <li className="py-2 text-xs text-muted">No data available for selected period.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceAdminPage;
