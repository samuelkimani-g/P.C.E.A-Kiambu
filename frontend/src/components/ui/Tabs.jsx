import { clsx } from 'clsx';

const Tabs = ({ tabs, current, onChange }) => {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl bg-slate-100/70 p-2">
      {tabs.map((tab) => {
        const isActive = tab.value === current;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={clsx(
              'flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition',
              isActive
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-slate-500 hover:bg-white hover:text-slate-700',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
