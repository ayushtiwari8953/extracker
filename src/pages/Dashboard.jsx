import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, Target, ArrowUpRight, ArrowDownRight, Plus, Lightbulb,
} from 'lucide-react';
import { useAllTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { useSettings } from '../context/SettingsContext';
import { totals, monthlyTotals, categoryBreakdown, insights } from '../services/analytics';
import { formatCurrency, monthKey, isSameMonth, formatRelative } from '../utils/formatters';
import { CATEGORY_META } from '../utils/constants';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import { IncomeExpenseLine, CategoryDoughnut } from '../components/charts/Charts';

export default function Dashboard() {
  const { items, loading } = useAllTransactions();
  const { items: budgets, loading: budgetsLoading } = useBudgets();
  const { settings } = useSettings();
  const [addOpen, setAddOpen] = useState(false);

  const stats = useMemo(() => {
    const t = totals(items);
    const thisMonth = items.filter((x) => isSameMonth(x.date, new Date()));
    const lastMonth = items.filter((x) => isSameMonth(x.date, new Date(Date.now() - 30 * 86400 * 1000)));
    const thisM = totals(thisMonth);
    const lastM = totals(lastMonth);
    const incomeTrend = lastM.income > 0 ? ((thisM.income - lastM.income) / lastM.income) * 100 : 0;
    const expenseTrend = lastM.expense > 0 ? ((thisM.expense - lastM.expense) / lastM.expense) * 100 : 0;
    const currentBudget = budgets.find((b) => b.month === monthKey(new Date()));
    const used = thisM.expense;
    const remaining = currentBudget ? currentBudget.amount - used : 0;
    return { ...t, incomeTrend, expenseTrend, currentBudget, used, remaining, thisM };
  }, [items, budgets]);

  const monthly = useMemo(() => monthlyTotals(items, 6), [items]);
  const expenseCats = useMemo(() => categoryBreakdown(items, 'expense').slice(0, 6), [items]);
  const recent = useMemo(() => [...items].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6), [items]);
  const ins = useMemo(() => insights(items.filter((x) => isSameMonth(x.date, new Date())), stats.currentBudget), [items, stats.currentBudget]);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Dashboard</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Your financial overview at a glance.</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Add transaction
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Balance" value={formatCurrency(stats.balance, settings.currency)} icon={Wallet} tone="brand" hint="Income minus expenses" />
        <StatCard label="Total Income" value={formatCurrency(stats.income, settings.currency)} icon={TrendingUp} tone="success" trend={stats.incomeTrend} />
        <StatCard label="Total Expenses" value={formatCurrency(stats.expense, settings.currency)} icon={TrendingDown} tone="error" trend={stats.expenseTrend} />
        <StatCard label="Total Savings" value={formatCurrency(stats.savings, settings.currency)} icon={PiggyBank} tone="success" hint={`${stats.savingsRate.toFixed(1)}% savings rate`} />
        <StatCard
          label="Monthly Budget"
          value={stats.currentBudget ? formatCurrency(stats.currentBudget.amount, settings.currency) : 'No budget'}
          icon={Target}
          tone="warning"
          hint={stats.currentBudget ? `For ${stats.currentBudget.month}` : 'Set one in Budgets'}
        />
        <StatCard
          label="Remaining Budget"
          value={stats.currentBudget ? formatCurrency(Math.max(0, stats.remaining), settings.currency) : '—'}
          icon={Target}
          tone={stats.remaining < 0 ? 'error' : 'brand'}
        >
          {stats.currentBudget && (
            <div className="mt-3">
              <ProgressBar value={stats.used} max={stats.currentBudget.amount} showLabel />
            </div>
          )}
        </StatCard>
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50">Income vs Expense</h3>
              <p className="text-xs text-ink-500 dark:text-ink-400">Last 6 months</p>
            </div>
            <Link to="/app/analytics" className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">View analytics →</Link>
          </div>
          <IncomeExpenseLine data={monthly} height={280} />
        </div>
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50">Expense Categories</h3>
            <p className="text-xs text-ink-500 dark:text-ink-400">All time</p>
          </div>
          {expenseCats.length ? (
            <CategoryDoughnut data={expenseCats} height={280} />
          ) : (
            <EmptyState title="No expenses yet" description="Add a transaction to see your category breakdown." />
          )}
        </div>
      </div>

      {/* Recent + insights */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 dark:border-ink-800/70">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50">Recent Transactions</h3>
            <Link to="/app/transactions" className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">View all →</Link>
          </div>
          {recent.length ? (
            <ul className="divide-y divide-ink-100 dark:divide-ink-800/60">
              {recent.map((t) => {
                const meta = CATEGORY_META[t.category] || { color: '#64748b' };
                const isIncome = t.type === 'income';
                return (
                  <li key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-ink-50/70 dark:hover:bg-ink-800/40">
                    <span className="grid h-9 w-9 place-items-center rounded-lg text-white shrink-0" style={{ background: meta.color }}>
                      <span className="text-xs font-bold">{t.category[0]}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">{t.title}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400">{t.category} · {formatRelative(t.date)}</p>
                    </div>
                    <span className={`text-sm font-semibold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isIncome ? '+' : '−'}{formatCurrency(t.amount, settings.currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title="No transactions yet" description="Your recent activity will appear here." action={<button onClick={() => setAddOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add one</button>} />
          )}
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50">Financial Insights</h3>
          </div>
          <ul className="space-y-3">
            {ins.map((i, idx) => (
              <li key={idx} className="flex gap-3 rounded-xl border border-ink-100 dark:border-ink-800/70 p-3">
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                  i.tone === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300' :
                  i.tone === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300' :
                  i.tone === 'error' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300' :
                  'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300'
                }`}>
                  {i.tone === 'success' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </span>
                <p className="text-sm text-ink-600 dark:text-ink-300 pt-0.5">{i.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-900/5 p-4">
            <p className="text-xs font-medium text-brand-700 dark:text-brand-300">This month</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-ink-600 dark:text-ink-300">Income</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.thisM.income, settings.currency)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm text-ink-600 dark:text-ink-300">Expenses</span>
              <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">{formatCurrency(stats.thisM.expense, settings.currency)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-brand-200/50 dark:border-brand-800/40 pt-2">
              <span className="text-sm font-medium text-ink-700 dark:text-ink-200">Net</span>
              <Badge variant={stats.thisM.balance >= 0 ? 'income' : 'expense'}>{formatCurrency(stats.thisM.balance, settings.currency)}</Badge>
            </div>
          </div>
        </div>
      </div>

      <TransactionFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
