import { classNames } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon, tone = 'default', trend, hint, children }) {
  const tones = {
    default: 'from-ink-50 to-ink-100 text-ink-700 dark:from-ink-800/40 dark:to-ink-900/40 dark:text-ink-200',
    brand: 'from-brand-50 to-brand-100 text-brand-700 dark:from-brand-900/30 dark:to-brand-900/10 dark:text-brand-300',
    success: 'from-emerald-50 to-emerald-100 text-emerald-700 dark:from-emerald-900/30 dark:to-emerald-900/10 dark:text-emerald-300',
    warning: 'from-amber-50 to-amber-100 text-amber-700 dark:from-amber-900/30 dark:to-amber-900/10 dark:text-amber-300',
    error: 'from-rose-50 to-rose-100 text-rose-700 dark:from-rose-900/30 dark:to-rose-900/10 dark:text-rose-300',
  };
  return (
    <div className="card p-5 group hover:shadow-glow transition-shadow duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-ink-900 dark:text-ink-50 truncate">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{hint}</p>}
        </div>
        {Icon && (
          <div className={classNames('grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br shadow-soft', tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          {trend >= 0 ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" /> +{trend.toFixed(1)}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <TrendingDown className="h-3.5 w-3.5" /> {trend.toFixed(1)}%
            </span>
          )}
          <span className="text-ink-400">vs last month</span>
        </div>
      )}
      {children}
    </div>
  );
}
