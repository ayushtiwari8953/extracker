import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { useAllTransactions } from '../hooks/useTransactions';
import { useSettings } from '../context/SettingsContext';
import { totals, monthlyTotals, weeklyTotals, yearlyTotals, categoryBreakdown, highest } from '../services/analytics';
import { formatCurrency } from '../utils/formatters';
import { MONTH_NAMES_FULL, CHART_PALETTE, CATEGORY_META } from '../utils/constants';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import { IncomeExpenseLine, CategoryDoughnut, CategoryPie, WeeklyBar, YearlyBar } from '../components/charts/Charts';

const RANGES = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'yearly', label: 'Yearly' },
];

export default function Analytics() {
  const { items, loading } = useAllTransactions();
  const { settings } = useSettings();
  const [range, setRange] = useState('monthly');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const stats = useMemo(() => totals(items), [items]);
  const monthly = useMemo(() => monthlyTotals(items, 6), [items]);
  const weekly = useMemo(() => weeklyTotals(items, year, month), [items, year, month]);
  const yearly = useMemo(() => yearlyTotals(items, 3), [items]);
  const expenseCats = useMemo(() => categoryBreakdown(items, 'expense'), [items]);
  const incomeCats = useMemo(() => categoryBreakdown(items, 'income'), [items]);
  const highestExpense = useMemo(() => highest(items, 'expense'), [items]);
  const highestIncome = useMemo(() => highest(items, 'income'), [items]);

  if (loading) {
    return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-32 animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Analytics</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Deep dive into your income, expenses and spending patterns.</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Income" value={formatCurrency(stats.income, settings.currency)} icon={TrendingUp} tone="success" />
        <StatCard label="Total Expenses" value={formatCurrency(stats.expense, settings.currency)} icon={TrendingDown} tone="error" />
        <StatCard label="Net Balance" value={formatCurrency(stats.balance, settings.currency)} icon={Wallet} tone="brand" />
        <StatCard label="Savings Rate" value={`${stats.savingsRate.toFixed(1)}%`} icon={PiggyBank} tone={stats.savingsRate >= 20 ? 'success' : 'warning'} />
      </div>

      {/* Range tabs */}
      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl bg-ink-100 dark:bg-ink-800/60 p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${range === r.key ? 'bg-white text-brand-700 shadow-soft dark:bg-ink-900 dark:text-brand-300' : 'text-ink-500 dark:text-ink-400'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {range === 'weekly' && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-ink-400" />
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input !py-1.5 w-36">
                {MONTH_NAMES_FULL.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input !py-1.5 w-24">
                {[year - 1, year, year + 1].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}
        </div>

        {range === 'monthly' && <IncomeExpenseLine data={monthly} height={320} />}
        {range === 'weekly' && <WeeklyBar data={weekly} height={320} />}
        {range === 'yearly' && <YearlyBar data={yearly} height={320} />}
      </div>

      {/* Category breakdown */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50 mb-1">Expense by Category</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mb-4">Doughnut view</p>
          {expenseCats.length ? <CategoryDoughnut data={expenseCats} height={300} /> : <EmptyState title="No expenses yet" />}
        </div>
        <div className="card p-5">
          <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50 mb-1">Income by Category</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mb-4">Pie view</p>
          {incomeCats.length ? <CategoryPie data={incomeCats} height={300} /> : <EmptyState title="No income yet" />}
        </div>
      </div>

      {/* Category list + extremes */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50 mb-4">Category Spending</h3>
          <ul className="space-y-3">
            {expenseCats.map((c, i) => {
              const meta = CATEGORY_META[c.category] || { color: CHART_PALETTE[i] };
              const pct = stats.expense > 0 ? (c.amount / stats.expense) * 100 : 0;
              return (
                <li key={c.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
                      <span className="font-medium text-ink-800 dark:text-ink-100">{c.category}</span>
                    </span>
                    <span className="text-ink-500 dark:text-ink-400">{formatCurrency(c.amount, settings.currency)} · {pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: meta.color }} />
                  </div>
                </li>
              );
            })}
            {expenseCats.length === 0 && <EmptyState title="No expense data" />}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp className="h-4 w-4 text-emerald-500" />
              <h3 className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Highest Income</h3>
            </div>
            {highestIncome ? (
              <>
                <p className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(highestIncome.amount, settings.currency)}</p>
                <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{highestIncome.title}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{highestIncome.category}</p>
              </>
            ) : <p className="text-sm text-ink-500">No income recorded.</p>}
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDown className="h-4 w-4 text-rose-500" />
              <h3 className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Highest Expense</h3>
            </div>
            {highestExpense ? (
              <>
                <p className="font-display text-xl font-bold text-rose-600 dark:text-rose-400">{formatCurrency(highestExpense.amount, settings.currency)}</p>
                <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{highestExpense.title}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{highestExpense.category}</p>
              </>
            ) : <p className="text-sm text-ink-500">No expenses recorded.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
