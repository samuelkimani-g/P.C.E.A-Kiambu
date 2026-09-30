import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../common/Avatar';
import Logo from '../common/Logo';
import { LogOut } from 'lucide-react';

const navigation = [
  { name: 'Home', to: '/member/home' },
  { name: 'Hymns', to: '/member/hymns' },
  { name: 'Livestreams', to: '/member/livestreams' },
  { name: 'Events', to: '/member/events' },
  { name: 'Profile', to: '/member/profile' },
];

const MemberLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Member Portal</p>
              <p className="text-xs text-muted">Welcome back, {user?.first_name || user?.username}</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-primary-100 text-primary-700' : 'text-muted hover:text-primary-600'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Avatar name={user?.full_name || user?.username} size="sm" subtitle="Member" />
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted transition hover:border-primary-200 hover:text-primary-600"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberLayout;
