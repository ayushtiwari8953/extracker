import { CATEGORY_META } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';
import Badge from '../ui/Badge';
import { Pencil, Trash2 } from 'lucide-react';

export default function TransactionRow({ txn, onEdit, onDelete }) {
  const { settings } = useSettings();
  const meta = CATEGORY_META[txn.category] || { color: '#64748b' };
  const isIncome = txn.type === 'income';
  return (
    <tr className="group border-b border-ink-100 dark:border-ink-800/60 last:border-0 hover:bg-ink-50/70 dark:hover:bg-ink-800/40 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg text-white shrink-0" style={{ background: meta.color }}>
            <span className="text-xs font-bold">{txn.category[0]}</span>
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">{txn.title}</p>
            <p className="truncate text-xs text-ink-500 dark:text-ink-400">{txn.category} · {formatDate(txn.date, { short: true })}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <Badge variant={isIncome ? 'income' : 'expense'}>{isIncome ? 'Income' : 'Expense'}</Badge>
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-sm text-ink-500 dark:text-ink-400">{txn.notes || '—'}</td>
      <td className={`px-4 py-3 text-sm font-semibold text-right ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
        {isIncome ? '+' : '−'}{formatCurrency(txn.amount, settings.currency)}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(txn)} className="btn-ghost !p-2 rounded-lg" aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(txn)} className="btn-ghost !p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
