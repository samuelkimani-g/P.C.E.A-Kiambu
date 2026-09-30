import { format, parseISO } from 'date-fns';

export const formatDate = (value, fallback = '—', dateFormat = 'PPP') => {
  if (!value) return fallback;
  try {
    const parsed = typeof value === 'string' ? parseISO(value) : value;
    return format(parsed, dateFormat);
  } catch {
    return fallback;
  }
};

export const formatDateTime = (value, fallback = '—') => formatDate(value, fallback, 'PPP p');

export const formatCurrency = (amount, currency = 'KES') => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return '—';
  }
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

export const formatStatus = (status) => {
  if (!status) return '—';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getInitials = (name = '') => {
  if (!name) return 'GU';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

export const ensureArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};
