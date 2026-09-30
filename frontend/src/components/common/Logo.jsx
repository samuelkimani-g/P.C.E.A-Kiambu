import { clsx } from 'clsx';
import LogoImage from '../../assets/pceakiambu.jpeg';

const Logo = ({ size = 'md', withText = true, className, textClassName }) => {
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div
        className={clsx(
          'overflow-hidden rounded-[18px] border border-white/60 bg-white shadow-lg shadow-primary-900/15 ring-4 ring-white/20',
          sizes[size],
        )}
      >
        <img
          src={LogoImage}
          alt="PCEA Kiambu Parish"
          className="h-full w-full object-cover object-center"
        />
      </div>
      {withText ? (
        <div className={clsx('leading-tight', textClassName)}>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary-700">PCEA</p>
          <p className="text-base font-semibold text-slate-900">Kiambu Parish</p>
        </div>
      ) : null}
    </div>
  );
};

export default Logo;
