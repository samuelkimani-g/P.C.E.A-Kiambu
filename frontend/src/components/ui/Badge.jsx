import { clsx } from 'clsx';

const variants = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  info: 'bg-primary-100 text-primary-700',
};

const Badge = ({ children, variant = 'default', className }) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-black/5',
      variants[variant] || variants.default,
      className,
    )}
  >
    {children}
  </span>
);

export default Badge;
