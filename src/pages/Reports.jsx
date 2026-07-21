import { useMemo, useState } from 'react';
import { FileText, Download, Printer, FileSpreadsheet, Calendar, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useAllTransactions } from '../hooks/useTransactions';
import { useSettings } from '../context/SettingsContext';
import { totals, categoryBreakdown } from '../services/analytics';
import { formatCurrency, monthKey, monthLabel, formatDate } from '../utils/formatters';
import { MONTH_NAMES_FULL } from '../utils/constants';
import { exportTransactionsCSV, exportReportPDF, printReport } from '../utils/exporters';
import { CATEGORY_META } from '../utils/constants';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';

const TYPES = [
  { key: 'monthly', label: 'Monthly Report' },
  { key: 'annual', label: 'Annual Report' },
];

export default function Reports() {
  const { items, loading } = useAllTransactions();
  const { settings } = useSettings();
  const now = new Date();
  const [type, setType] = useState('monthly');
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const filtered = useMemo(() => {
    return items.filter((t) => {
      const d = new Date(t.date);
      if (type === 'monthly') return d.getMonth() === month && d.getFullYear() === year;
      return d.getFullYear() === year;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [items, type, month, year]);

  const t = useMemo(() => totals(filtered), [filtered]);
  const expenseCats = useMemo(() => categoryBreakdown(filtered, 'expense'), [filtered]);
  const incomeCats = useMemo(() => categoryBreakdown(filtered, 'income'), [filtered]);

  const title = type === 'monthly' ? `${MONTH_NAMES_FULL[month]} ${year} Report` : `${year} Annual Report`;
  const subtitle = type === 'monthly' ? 'Monthly financial summary' : 'Yearly financial summary';

  const report = {
    title, subtitle, currency: settings.currency,
    income: t.income, expense: t.expense, net: t.balance,
    transactions: filtered,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Reports</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Generate and export your financial reports.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium text-ink-500 dark:text-ink-400">Report type</label>
            <div className="mt-1 inline-flex rounded-xl bg-ink-100 dark:bg-ink-800/60 p-1">
              {TYPES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setType(r.key)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${type === r.key ? 'bg-white text-brand-700 shadow-soft dark:bg-ink-900 dark:text-brand-300' : 'text-ink-500 dark:text-ink-400'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          {type === 'monthly' && (
            <div>
              <label className="text-xs font-medium text-ink-500 dark:text-ink-400">Month</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input mt-1 w-40">
                {MONTH_NAMES_FULL.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-ink-500 dark:text-ink-400">Year</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input mt-1 w-28">
              {[now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <button onClick={() => exportTransactionsCSV(filtered, settings.currency, `${title.replace(/\s+/g, '_')}.csv`)} className="btn-outline">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </button>
            <button onClick={() => exportReportPDF(report)} className="btn-outline">
              <Download className="h-4 w-4" /> PDF
            </button>
            <button onClick={() => printReport(report)} className="btn-primary">
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Report preview */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900 dark:text-ink-50">{title}</h2>
            <p className="text-sm text-ink-500 dark:text-ink-400">{subtitle} · Generated {formatDate(new Date())}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10 p-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300"><TrendingUp className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wider">Income</span></div>
            <p className="mt-1.5 font-display text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(t.income, settings.currency)}</p>
          </div>
          <div className="rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-900/10 p-4">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300"><TrendingDown className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wider">Expense</span></div>
            <p className="mt-1.5 font-display text-xl font-bold text-rose-700 dark:text-rose-300">{formatCurrency(t.expense, settings.currency)}</p>
          </div>
          <div className="rounded-xl border border-brand-200/60 dark:border-brand-900/40 bg-brand-50/50 dark:bg-brand-900/10 p-4">
            <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300"><Wallet className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wider">Net</span></div>
            <p className="mt-1.5 font-display text-xl font-bold text-brand-700 dark:text-brand-300">{formatCurrency(t.balance, settings.currency)}</p>
          </div>
          <div className="rounded-xl border border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-800/20 p-4">
            <div className="flex items-center gap-2 text-ink-600 dark:text-ink-300"><Calendar className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wider">Records</span></div>
            <p className="mt-1.5 font-display text-xl font-bold text-ink-900 dark:text-ink-50">{filtered.length}</p>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-700 dark:text-ink-200">Income by Category</h3>
            <ul className="space-y-1.5">
              {incomeCats.map((c) => {
                const meta = CATEGORY_META[c.category] || { color: '#64748b' };
                return (
                  <li key={c.category} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />{c.category}</span>
                    <span className="text-ink-500 dark:text-ink-400">{formatCurrency(c.amount, settings.currency)}</span>
                  </li>
                );
              })}
              {incomeCats.length === 0 && <li className="text-sm text-ink-400">No income in this period.</li>}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-700 dark:text-ink-200">Expense by Category</h3>
            <ul className="space-y-1.5">
              {expenseCats.map((c) => {
                const meta = CATEGORY_META[c.category] || { color: '#64748b' };
                return (
                  <li key={c.category} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />{c.category}</span>
                    <span className="text-ink-500 dark:text-ink-400">{formatCurrency(c.amount, settings.currency)}</span>
                  </li>
                );
              })}
              {expenseCats.length === 0 && <li className="text-sm text-ink-400">No expenses in this period.</li>}
            </ul>
          </div>
        </div>

        {/* Transactions table */}
        <div className="mt-6 overflow-x-auto scrollbar-thin">
          {filtered.length === 0 ? (
            <EmptyState title="No transactions in this period" description="Pick a different month or year to see data." />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                <tr className="border-b border-ink-100 dark:border-ink-800/70">
                  <th className="px-3 py-2 font-semibold">Title</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">Category</th>
                  <th className="px-3 py-2 font-semibold text-right">Amount</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn) => (
                  <tr key={txn.id} className="border-b border-ink-100 dark:border-ink-800/60">
                    <td className="px-3 py-2.5 font-medium text-ink-900 dark:text-ink-50">{txn.title}</td>
                    <td className="px-3 py-2.5"><Badge variant={txn.type === 'income' ? 'income' : 'expense'}>{txn.type}</Badge></td>
                    <td className="px-3 py-2.5 text-ink-500 dark:text-ink-400">{txn.category}</td>
                    <td className={`px-3 py-2.5 text-right font-semibold ${txn.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {txn.type === 'income' ? '+' : '−'}{formatCurrency(txn.amount, settings.currency)}
                    </td>
                    <td className="px-3 py-2.5 text-ink-500 dark:text-ink-400">{formatDate(txn.date, { short: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
