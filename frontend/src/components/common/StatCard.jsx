import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, accent = 'primary' }) => (
  <div className="card flex flex-col gap-3 p-6">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value ?? '—'}</p>
      </div>
      {Icon ? (
        <span
          className={clsx(
            'inline-flex h-12 w-12 items-center justify-center rounded-2xl text-lg text-white shadow-lg',
            accent === 'primary' && 'bg-primary-500',
            accent === 'accent' && 'bg-accent text-slate-900',
            accent === 'emerald' && 'bg-emerald-500',
          )}
        >
          <Icon className="h-6 w-6" />
        </span>
      ) : null}
    </div>
    {trend ? (
      <p
        className={clsx(
          'text-xs font-medium',
          trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-600' : 'text-muted',
        )}
      >
        {trend > 0 ? '+' : ''}
        {trend}% {trendLabel || 'vs last period'}
      </p>
    ) : null}
  </div>
);

export default StatCard;
