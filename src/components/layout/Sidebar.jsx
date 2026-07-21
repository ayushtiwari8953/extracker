import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Wallet, FileText,
  User as UserIcon, Settings, ShieldCheck, LogOut, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { classNames } from '../../utils/formatters';
import Avatar from '../ui/Avatar';
import { APP_NAME } from '../../utils/constants';

const nav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/app/analytics', label: 'Analytics', icon: PieChart },
  { to: '/app/budgets', label: 'Budgets', icon: Wallet },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/app/profile', label: 'Profile', icon: UserIcon },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink-950/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={classNames(
          'fixed inset-y-0 left-0 z-40 w-72 flex flex-col border-r border-ink-200/70 bg-white dark:border-ink-800/70 dark:bg-ink-950 transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-extrabold tracking-tight text-ink-900 dark:text-white">{APP_NAME}</p>
              <p className="-mt-1 text-[11px] text-ink-500 dark:text-ink-400">Expense Tracker</p>
            </div>
          </div>
          <button className="btn-ghost !p-2 lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800/60'
                )
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <>
              <div className="my-3 border-t border-ink-200/70 dark:border-ink-800/70" />
              <NavLink
                to="/app/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  classNames(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                      : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800/60'
                  )
                }
              >
                <ShieldCheck className="h-[18px] w-[18px]" />
                Admin
              </NavLink>
            </>
          )}
        </nav>

        <div className="border-t border-ink-200/70 dark:border-ink-800/70 p-3">
          <div className="flex items-center gap-3 rounded-xl p-2.5">
            <Avatar name={user?.name} src={user?.avatar} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900 dark:text-ink-50">{user?.name}</p>
              <p className="truncate text-xs text-ink-500 dark:text-ink-400">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="btn-ghost !p-2 rounded-lg text-ink-500 hover:text-rose-500" aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
