import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, Wallet, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { useAllTransactions } from '../hooks/useTransactions';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatCurrency, monthKey, monthLabel, isSameMonth } from '../utils/formatters';
import { MONTH_NAMES_FULL } from '../utils/constants';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function Budgets() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { items: budgets, loading, reload } = useBudgets();
  const { items: txns } = useAllTransactions();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const now = new Date();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { month: monthKey(now), amount: '' },
  });

  const enriched = useMemo(() => {
    return budgets
      .map((b) => {
        const spent = txns.filter((t) => t.type === 'expense' && monthKey(t.date) === b.month).reduce((s, t) => s + t.amount, 0);
        const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
        return { ...b, spent, remaining: b.amount - spent, pct };
      })
      .sort((a, b) => (a.month < b.month ? 1 : -1));
  }, [budgets, txns]);

  const openAdd = () => {
    setEditing(null);
    reset({ month: monthKey(now), amount: '' });
    setFormOpen(true);
  };
  const openEdit = (b) => {
    setEditing(b);
    reset({ month: b.month, amount: b.amount });
    setFormOpen(true);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await api.updateBudget(user.id, editing.id, { amount: Number(data.amount) });
        toast.success('Budget updated');
      } else {
        await api.createBudget(user.id, { month: data.month, amount: Number(data.amount) });
        toast.success('Budget created');
      }
      setFormOpen(false);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.deleteBudget(user.id, deleting.id);
      toast.success('Budget deleted');
      setDeleting(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const totalBudget = enriched.reduce((s, b) => s + b.amount, 0);
  const totalSpent = enriched.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Budgets</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Plan monthly spending and stay on track.</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> New budget
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-500 dark:text-ink-400"><Wallet className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wider">Total Budgeted</span></div>
          <p className="mt-2 font-display text-2xl font-bold text-ink-900 dark:text-ink-50">{formatCurrency(totalBudget, settings.currency)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-500 dark:text-ink-400"><TrendingUp className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wider">Total Spent</span></div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-600 dark:text-rose-400">{formatCurrency(totalSpent, settings.currency)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-500 dark:text-ink-400"><CheckCircle2 className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wider">Total Remaining</span></div>
          <p className={`mt-2 font-display text-2xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{formatCurrency(totalBudget - totalSpent, settings.currency)}</p>
        </div>
      </div>

      {/* Budget cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : enriched.length === 0 ? (
        <div className="card">
          <EmptyState icon={Wallet} title="No budgets yet" description="Create a monthly budget to start tracking your spending limits." action={<button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" /> Create budget</button>} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {enriched.map((b) => {
            const status = b.pct >= 100 ? 'exceeded' : b.pct >= 80 ? 'warning' : 'ok';
            const isCurrent = b.month === monthKey(now);
            return (
              <div key={b.id} className="card p-5 group">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">{monthLabel(b.month)}</h3>
                      {isCurrent && <Badge variant="info">Current</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">Budget {formatCurrency(b.amount, settings.currency)}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(b)} className="btn-ghost !p-2 rounded-lg"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleting(b)} className="btn-ghost !p-2 rounded-lg text-rose-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar value={b.spent} max={b.amount} showLabel />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-ink-50 dark:bg-ink-800/40 p-2.5">
                    <p className="text-xs text-ink-500 dark:text-ink-400">Spent</p>
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{formatCurrency(b.spent, settings.currency)}</p>
                  </div>
                  <div className="rounded-xl bg-ink-50 dark:bg-ink-800/40 p-2.5">
                    <p className="text-xs text-ink-500 dark:text-ink-400">Remaining</p>
                    <p className={`text-sm font-semibold ${b.remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{formatCurrency(b.remaining, settings.currency)}</p>
                  </div>
                  <div className="rounded-xl bg-ink-50 dark:bg-ink-800/40 p-2.5">
                    <p className="text-xs text-ink-500 dark:text-ink-400">Used</p>
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{b.pct.toFixed(0)}%</p>
                  </div>
                </div>

                {status === 'exceeded' && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="h-4 w-4" /> You've exceeded this budget by {formatCurrency(Math.abs(b.remaining), settings.currency)}.
                  </div>
                )}
                {status === 'warning' && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" /> You've used {b.pct.toFixed(0)}% of your budget. Slow down to stay on track.
                  </div>
                )}
                {status === 'ok' && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" /> You're within budget. Keep it up!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Budget' : 'New Budget'}
        footer={
          <>
            <button className="btn-outline" onClick={() => setFormOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit(onSubmit)} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Month</label>
            <input
              type="month"
              disabled={!!editing}
              className="input mt-1 disabled:opacity-60"
              {...register('month', { required: 'Month is required' })}
            />
            {errors.month && <p className="mt-1 text-xs text-rose-500">{errors.month.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Budget amount</label>
            <input type="number" min="0" step="0.01" className="input mt-1" placeholder="e.g. 40000" {...register('amount', { required: 'Amount is required', min: 0.01 })} />
            {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount.message}</p>}
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete budget?"
        message={`The budget for ${deleting ? monthLabel(deleting.month) : ''} will be removed.`}
        confirmText="Delete"
      />
    </div>
  );
}
