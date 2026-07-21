import { Sun, Moon, Bell, BellOff, DollarSign, Palette, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { CURRENCY_OPTIONS } from '../utils/constants';
import { classNames } from '../utils/formatters';
import { toast } from 'react-toastify';

export default function Settings() {
  const { settings, update } = useSettings();

  const toggleTheme = (theme) => {
    update({ theme });
    toast.success(`${theme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
  };

  const setCurrency = (code) => {
    update({ currency: code });
    toast.success(`Currency set to ${code}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Settings</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Customize FinTrack to your preferences.</p>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-brand-500" />
          <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50">Appearance</h3>
        </div>
        <p className="mb-3 text-sm text-ink-500 dark:text-ink-400">Choose how FinTrack looks. Your preference is saved automatically.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => toggleTheme('light')}
            className={classNames(
              'flex items-center gap-3 rounded-xl border p-4 text-left transition',
              settings.theme === 'light' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20' : 'border-ink-200 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800/40'
            )}
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-100 text-amber-600"><Sun className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="font-semibold text-ink-900 dark:text-ink-50">Light</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">Bright and clean</p>
            </div>
            {settings.theme === 'light' && <Check className="h-5 w-5 text-brand-600" />}
          </button>
          <button
            onClick={() => toggleTheme('dark')}
            className={classNames(
              'flex items-center gap-3 rounded-xl border p-4 text-left transition',
              settings.theme === 'dark' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20' : 'border-ink-200 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800/40'
            )}
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink-800 text-ink-100"><Moon className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="font-semibold text-ink-900 dark:text-ink-50">Dark</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">Easy on the eyes</p>
            </div>
            {settings.theme === 'dark' && <Check className="h-5 w-5 text-brand-600" />}
          </button>
        </div>
      </div>

      {/* Currency */}
      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-brand-500" />
          <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50">Currency</h3>
        </div>
        <p className="mb-3 text-sm text-ink-500 dark:text-ink-400">Select the currency used across the app.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CURRENCY_OPTIONS.map((c) => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code)}
              className={classNames(
                'flex items-center gap-3 rounded-xl border p-4 text-left transition',
                settings.currency === c.code ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20' : 'border-ink-200 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800/40'
              )}
            >
              <span className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">{c.symbol}</span>
              <div className="flex-1">
                <p className="font-semibold text-ink-900 dark:text-ink-50">{c.code}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{c.label}</p>
              </div>
              {settings.currency === c.code && <Check className="h-5 w-5 text-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-brand-500" />
          <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50">Notifications</h3>
        </div>
        <div className="space-y-3">
          <ToggleRow
            icon={settings.notifications ? Bell : BellOff}
            title="Toast notifications"
            desc="Show success, error and warning toasts."
            value={settings.notifications}
            onChange={(v) => { update({ notifications: v }); toast.info(v ? 'Notifications on' : 'Notifications off'); }}
          />
          <ToggleRow
            icon={Bell}
            title="Budget alerts"
            desc="Warn me when a budget hits 80% or is exceeded."
            value={settings.lowBalanceAlerts}
            onChange={(v) => { update({ lowBalanceAlerts: v }); toast.info(v ? 'Budget alerts on' : 'Budget alerts off'); }}
          />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, title, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-ink-100 dark:border-ink-800/70 p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-300">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{title}</p>
          <p className="text-xs text-ink-500 dark:text-ink-400">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={classNames('relative h-6 w-11 rounded-full transition', value ? 'bg-brand-600' : 'bg-ink-200 dark:bg-ink-700')}
        aria-pressed={value}
      >
        <span className={classNames('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', value ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  );
}
