import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900">
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-16 lg:px-8">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <Link to="/" className="inline-flex items-center gap-3 text-lg font-semibold text-white/90">
          <Logo size="lg" withText={false} />
          <div className="text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">PCEA</p>
            <p className="text-base font-semibold text-white/90">Kiambu Parish</p>
          </div>
        </Link>
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Serving together in faith</p>
      </div>

      <div className="w-full max-w-xl rounded-3xl bg-white/10 p-1 shadow-2xl backdrop-blur-sm">
        <div className="card w-full rounded-[calc(theme(borderRadius.3xl)-4px)] border border-white/10 bg-white/95 px-10 py-12 shadow-lg">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
          </div>
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
