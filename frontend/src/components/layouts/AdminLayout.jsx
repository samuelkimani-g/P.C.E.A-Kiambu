import { NavLink, Outlet } from 'react-router-dom';
import {
  HomeModernIcon,
  MegaphoneIcon,
  MusicalNoteIcon,
  PlayCircleIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../common/Avatar';
import Logo from '../common/Logo';

const navigation = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: HomeModernIcon },
  { name: 'Members', to: '/admin/members', icon: UsersIcon },
  { name: 'Announcements', to: '/admin/announcements', icon: MegaphoneIcon },
  { name: 'Hymns', to: '/admin/hymns', icon: MusicalNoteIcon },
  { name: 'Livestreams', to: '/admin/livestreams', icon: PlayCircleIcon },
  { name: 'SMS', to: '/admin/sms', icon: ChatBubbleLeftRightIcon },
  { name: 'Finance', to: '/admin/finance', icon: CurrencyDollarIcon },
  { name: 'Events', to: '/admin/events', icon: CalendarDaysIcon },
  { name: 'Settings', to: '/admin/settings', icon: Cog6ToothIcon },
];

const AdminLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-72 flex-col border-r border-white/10 bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 p-6 text-sm text-primary-50 lg:flex">
        <div className="mb-10 flex items-center gap-3 text-primary-50">
          <Logo size="md" withText={false} />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-100/80">PCEA</p>
            <p className="text-base font-semibold">Kiambu Parish</p>
            <p className="text-xs text-primary-100/70">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 space-y-3 text-sm">
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs uppercase tracking-widest text-white/60">Need Assistance?</p>
            <p className="mt-2 text-sm text-white/90">Email <span className="font-semibold">support@pcea.org</span></p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex w-full flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <Logo size="sm" />
            </div>
            <div className="hidden flex-1 lg:flex">
              <div className="relative w-full max-w-md">
                <input
                  type="search"
                  placeholder="Search members, announcements..."
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-100"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="hidden rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-primary-200 hover:text-primary-600 lg:inline-flex"
              >
                Sunday Service Mode
              </button>
              <Avatar name={user?.full_name || user?.username} subtitle={user?.role} />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
