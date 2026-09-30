import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/client';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { HYMN_LANGUAGES } from '../../utils/constants';

const MemberHymnsPage = () => {
  const [hymns, setHymns] = useState([]);
  const [query, setQuery] = useState({ q: '', language: '' });
  const [randomHymn, setRandomHymn] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHymns = async (params = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/hymns/', { params });
      const payload = response.data?.results || response.data?.data || response.data;
      setHymns(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (error) {
      toast.error('Unable to load hymns');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomHymn = async () => {
    try {
      const response = await api.get('/hymns/random/');
      setRandomHymn(response.data?.data || response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setRandomHymn(null);
      } else {
        toast.error('Unable to fetch a random hymn');
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchHymns(query);
    fetchRandomHymn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (event) => {
    event.preventDefault();
    fetchHymns(query);
  };

  return (
    <div className="space-y-8">
      <section className="card space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Songbook</h1>
        <p className="text-sm text-muted">
          Search for hymns by number, title, or language and prepare for worship services.
        </p>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={onSearch}>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Search</label>
            <input
              type="search"
              placeholder="Amazing Grace"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              value={query.q}
              onChange={(event) => setQuery((prev) => ({ ...prev, q: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Language</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              value={query.language}
              onChange={(event) => setQuery((prev) => ({ ...prev, language: event.target.value }))}
            >
              <option value="">All languages</option>
              {HYMN_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">Search hymns</button>
            <button type="button" className="btn-secondary" onClick={fetchRandomHymn}>
              Inspire me with a random hymn
            </button>
          </div>
        </form>
      </section>

      {randomHymn ? (
        <section className="card space-y-3 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Random hymn suggestion • <span className="text-primary-600">#{randomHymn.number}</span>
            </h2>
            <Badge>{randomHymn.language}</Badge>
          </div>
          <h3 className="text-base font-semibold text-slate-900">{randomHymn.title}</h3>
          <pre className="whitespace-pre-wrap rounded-2xl bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
            {randomHymn.lyrics}
          </pre>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Browse hymns</h2>
        <DataTable
          columns={[
            { Header: 'No.', accessor: 'number' },
            { Header: 'Title', accessor: 'title' },
            {
              Header: 'Language',
              accessor: 'language',
              Cell: (item) => <Badge>{item.language}</Badge>,
            },
            {
              Header: 'Category',
              accessor: 'category',
              Cell: (item) => <span className="text-xs text-muted">{item.category}</span>,
            },
          ]}
          data={hymns}
          emptyState={loading ? 'Loading hymns...' : 'No hymns match your filters'}
          dense
        />
      </section>
    </div>
  );
};

export default MemberHymnsPage;
