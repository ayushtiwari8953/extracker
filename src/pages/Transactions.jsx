import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Search, Plus, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowUpDown, Pencil, Trash2, X } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useSettings } from '../context/SettingsContext';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, ALL_CATEGORIES, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../utils/constants';
import { formatCurrency, debounce } from '../utils/formatters';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TransactionRow from '../components/transactions/TransactionRow';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonRow } from '../components/ui/Skeleton';

export default function Transactions() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const debouncedSetSearch = useMemo(() => debounce((v) => { setDebouncedSearch(v); setPage(1); }, 300), []);

  const params = useMemo(() => ({
    search: debouncedSearch, type, category, from, to, sortBy, sortDir, page, pageSize,
  }), [debouncedSearch, type, category, from, to, sortBy, sortDir, page, pageSize]);

  const { items, total, totalPages, loading, error, reload } = useTransactions(params);

  const onSearchChange = (v) => {
    setSearch(v);
    debouncedSetSearch(v);
  };

  const resetFilters = () => {
    setSearch(''); setDebouncedSearch(''); setType(''); setCategory(''); setFrom(''); setTo(''); setPage(1);
  };

  const hasFilters = type || category || from || to || debouncedSearch;

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (txn) => { setEditing(txn); setFormOpen(true); };

  const confirmDelete = async () => {
    try {
      await api.deleteTransaction(user.id, deleting.id);
      toast.success('Transaction deleted');
      setDeleting(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('desc'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Transactions</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">{total} total · manage every record</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Add transaction
        </button>
      </div>

      {/* Toolbar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title or notes…"
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="input sm:w-36">
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="input sm:w-40">
              <option value="">All categories</option>
              <optgroup label="Income">
                {INCOME_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label="Expense">
                {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            </select>
            <button onClick={() => setShowFilters((s) => !s)} className={`btn-outline ${showFilters ? 'border-brand-500 text-brand-600' : ''}`}>
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end border-t border-ink-100 dark:border-ink-800/70 pt-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-ink-500 dark:text-ink-400">From date</label>
              <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="input mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-ink-500 dark:text-ink-400">To date</label>
              <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="input mt-1" />
            </div>
            {hasFilters && (
              <button onClick={resetFilters} className="btn-ghost text-rose-500">
                <X className="h-4 w-4" /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left">
            <thead className="bg-ink-50/70 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <button onClick={() => toggleSort('title')} className="inline-flex items-center gap-1 hover:text-ink-700 dark:hover:text-ink-200">
                    Transaction <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Notes</th>
                <th className="px-4 py-3 font-semibold text-right">
                  <button onClick={() => toggleSort('amount')} className="inline-flex items-center gap-1 hover:text-ink-700 dark:hover:text-ink-200">
                    Amount <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
              ) : error ? (
                <tr><td colSpan={5}><ErrorState message={error} onRetry={reload} /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5}><EmptyState title="No transactions found" description={hasFilters ? 'Try adjusting your filters.' : 'Add your first transaction to get started.'} action={<button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" /> Add transaction</button>} /></td></tr>
              ) : (
                items.map((t) => (
                  <TransactionRow key={t.id} txn={t} onEdit={openEdit} onDelete={setDeleting} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && items.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-ink-100 dark:border-ink-800/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
              <span>Rows per page</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="input !py-1 !px-2 w-16 text-xs">
                {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="ml-2">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost !p-2 disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-xs text-ink-500 dark:text-ink-400">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost !p-2 disabled:opacity-40">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionFormModal open={formOpen} onClose={() => setFormOpen(false)} transaction={editing} onSaved={reload} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete transaction?"
        message={`"${deleting?.title}" (${formatCurrency(deleting?.amount || 0, settings.currency)}) will be permanently removed.`}
        confirmText="Delete"
      />
    </div>
  );
}
