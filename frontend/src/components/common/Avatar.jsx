import { getInitials } from '../../utils/format';

const Avatar = ({ name, subtitle, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 ${sizes[size]}`}>
        {getInitials(name)}
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
      </div>
    </div>
  );
};

export default Avatar;
