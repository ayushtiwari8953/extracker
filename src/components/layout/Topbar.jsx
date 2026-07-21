import { Menu, Moon, Sun, Plus, Bell } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

export default function Topbar({ onMenu, onQuickAdd }) {
  const { settings, update } = useSettings();
  const { user } = useAuth();
  const dark = settings.theme === 'dark';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-200/70 bg-white/80 px-4 backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-950/80 lg:px-6">
      <button className="btn-ghost !p-2 lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden sm:flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
        <span className="font-medium text-ink-900 dark:text-ink-50">Welcome back,</span>
        <span className="font-semibold">{user?.name?.split(' ')[0]}</span>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => update({ theme: dark ? 'light' : 'dark' })}
          className="btn-ghost !p-2 rounded-lg"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="btn-ghost !p-2 rounded-lg relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-ink-950" />
        </button>
        <button onClick={onQuickAdd} className="btn-primary hidden sm:inline-flex">
          <Plus className="h-4 w-4" /> Add
        </button>
        <button onClick={onQuickAdd} className="btn-primary !px-2.5 sm:hidden" aria-label="Add transaction">
          <Plus className="h-4 w-4" />
        </button>
        <Avatar name={user?.name} src={user?.avatar} size="md" className="ml-1" />
      </div>
    </header>
  );
}
