import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';
import api from '../../api/client';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { HYMN_LANGUAGES } from '../../utils/constants';

const categories = ['worship', 'praise', 'thanksgiving', 'prayer', 'communion', 'christmas', 'easter', 'other'];

const HymnsAdminPage = () => {
  const [hymns, setHymns] = useState([]);
  const [query, setQuery] = useState({ q: '', category: '', language: '' });
  const [importLanguage, setImportLanguage] = useState('english');
  const [importResults, setImportResults] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      number: '',
      category: 'worship',
      language: 'english',
      lyrics: '',
    },
  });

  const fetchHymns = async (params = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/hymns/', { params: { ...params, ordering: 'number' } });
      const payload = response.data?.results || response.data?.data || response.data;
      setHymns(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (error) {
      toast.error('Unable to load hymns');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoldenBells = async () => {
    try {
      setImportLoading(true);
      const response = await api.get('/hymns/golden-bells/', { params: { language: importLanguage || undefined } });
      if (response.data?.warning) {
        toast(response.data.warning, { icon: '⚠️' });
      }
      const results = response.data?.results || response.data || [];
      setImportResults(results);
    } catch (error) {
      toast.error('Unable to reach Golden Bells collection');
      console.error(error);
    } finally {
      setImportLoading(false);
    }
  };

  const importHymn = async (hymn) => {
    try {
      await api.post('/hymns/', {
        title: hymn.title,
        number: hymn.number,
        lyrics: hymn.lyrics,
        category: hymn.category || 'worship',
        language: hymn.language || importLanguage || 'english',
      });
      toast.success(`Imported ${hymn.title}`);
      fetchHymns(query);
    } catch (error) {
      toast.error('Unable to import hymn');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHymns(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateHymn = async (values) => {
    try {
      await api.post('/hymns/', { ...values, number: Number(values.number) });
      toast.success('Hymn added');
      reset({ title: '', number: '', category: values.category, language: values.language, lyrics: '' });
      fetchHymns(query);
    } catch (error) {
      toast.error('Failed to add hymn');
      console.error(error);
    }
  };

  const onSearch = async (event) => {
    event.preventDefault();
    fetchHymns(query);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'No.',
        accessor: 'number',
        Cell: (item) => <span className="font-semibold text-primary-600">#{item.number}</span>,
      },
      {
        Header: 'Title',
        accessor: 'title',
        Cell: (item) => (
          <div>
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="text-xs text-muted">{item.category}</p>
          </div>
        ),
      },
      {
        Header: 'Language',
        accessor: 'language',
        Cell: (item) => <Badge>{item.language}</Badge>,
      },
      {
        Header: 'Preview',
        accessor: 'lyrics',
        Cell: (item) => <p className="line-clamp-2 text-xs text-muted">{item.lyrics}</p>,
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hymn repository"
        description="Manage the congregational hymns across different languages."
      />

      <form onSubmit={onSearch} className="card grid gap-4 p-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Search hymns</label>
          <input
            type="search"
            placeholder="Search by title or lyrics"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
            value={query.q}
            onChange={(event) => setQuery((prev) => ({ ...prev, q: event.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Language</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
            value={query.language}
            onChange={(event) => setQuery((prev) => ({ ...prev, language: event.target.value }))}
          >
            <option value="">All</option>
            {HYMN_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Category</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
            value={query.category}
            onChange={(event) => setQuery((prev) => ({ ...prev, category: event.target.value }))}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full">
            Search hymns
          </button>
        </div>
      </form>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">All hymns</h2>
          <DataTable columns={columns} data={hymns} emptyState={loading ? 'Loading hymns...' : 'No hymns recorded yet'} dense />
        </div>
        <div className="space-y-6">
          <div className="card space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <MusicalNoteIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Add new hymn</h2>
                <p className="text-sm text-muted">Capture new songs for worship teams and congregational singing.</p>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(onCreateHymn)}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Title</label>
                <input
                  type="text"
                  placeholder="Great Is Thy Faithfulness"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title ? <p className="text-xs text-rose-500">{errors.title.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Number</label>
                <input
                  type="number"
                  placeholder="345"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...register('number', { required: 'Number is required' })}
                />
                {errors.number ? <p className="text-xs text-rose-500">{errors.number.message}</p> : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">Language</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                    {...register('language')}
                  >
                    {HYMN_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">Category</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                    {...register('category')}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Lyrics</label>
                <textarea
                  rows={5}
                  placeholder="Enter the hymn verses with stanza separators"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none"
                  {...register('lyrics', { required: 'Lyrics are required' })}
                />
                {errors.lyrics ? <p className="text-xs text-rose-500">{errors.lyrics.message}</p> : null}
              </div>
              <button type="submit" className="btn-primary w-full">
                Save hymn
              </button>
            </form>
          </div>

          <div className="card space-y-4 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Golden Bells library</h2>
                <p className="text-sm text-muted">Search the Golden Bells collection and import directly.</p>
              </div>
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                value={importLanguage}
                onChange={(event) => setImportLanguage(event.target.value)}
              >
                {HYMN_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="btn-secondary" onClick={fetchGoldenBells} disabled={importLoading}>
              {importLoading ? 'Fetching…' : 'Fetch Golden Bells hymns'}
            </button>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {importResults.length === 0 && !importLoading ? (
                <p className="text-sm text-muted">Choose a language and fetch to preview hymns.</p>
              ) : (
                importResults.map((hymn) => (
                  <div key={`${hymn.language}-${hymn.number}-${hymn.title}`} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">#{hymn.number} • {hymn.title}</p>
                        <p className="text-xs text-muted capitalize">{hymn.language}</p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary px-3 py-1 text-xs"
                        onClick={() => importHymn(hymn)}
                      >
                        Import
                      </button>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-muted">{hymn.lyrics}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HymnsAdminPage;
``