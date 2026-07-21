import { classNames } from '../../utils/formatters';

export default function ProgressBar({ value, max = 100, tone = 'brand', showLabel = false, height = 'h-2' }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  const tones = {
    brand: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
  };
  const auto = pct >= 100 ? 'error' : pct >= 80 ? 'warning' : tone;
  return (
    <div className="w-full">
      <div className={classNames('w-full rounded-full bg-ink-200/70 dark:bg-ink-800 overflow-hidden', height)}>
        <div
          className={classNames('h-full rounded-full transition-all duration-500', tones[auto])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-ink-500 dark:text-ink-400">
          <span>{pct.toFixed(0)}% used</span>
          <span>{pct >= 100 ? 'Exceeded' : `${(100 - pct).toFixed(0)}% left`}</span>
        </div>
      )}
    </div>
  );
}
