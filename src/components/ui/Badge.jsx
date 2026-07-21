import { classNames } from '../../utils/formatters';

const variants = {
  default: 'bg-ink-100 text-ink-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-rose-100 text-rose-700',
  info: 'bg-brand-100 text-brand-700',
  income: 'bg-emerald-100 text-emerald-700',
  expense: 'bg-rose-100 text-rose-700',
};

const darkVariants = {
  default: 'dark:bg-ink-800 dark:text-ink-200',
  success: 'dark:bg-emerald-900/40 dark:text-emerald-300',
  warning: 'dark:bg-amber-900/40 dark:text-amber-300',
  error: 'dark:bg-rose-900/40 dark:text-rose-300',
  info: 'dark:bg-brand-900/40 dark:text-brand-300',
  income: 'dark:bg-emerald-900/40 dark:text-emerald-300',
  expense: 'dark:bg-rose-900/40 dark:text-rose-300',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={classNames('chip', variants[variant], darkVariants[variant], className)}>
      {children}
    </span>
  );
}
