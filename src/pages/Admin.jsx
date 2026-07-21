import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Users, ArrowLeftRight, TrendingUp, TrendingDown, ShieldCheck, Trash2, Search, Wallet } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency, formatDate, debounce } from '../utils/formatters';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';
import StatCard from '../components/ui/StatCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function Admin() {
  const { settings } = useSettings();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [tab, setTab] = useState('users');

  const debouncedSet = useMemo(() => debounce(setDebouncedSearch, 300), []);
  const reload = useCallback(() => {
    setLoading(true);
    Promise.all([api.adminStats(), api.adminListUsers()])
      .then(([s, u]) => { setStats(s); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload]);
  useEffect(() => { debouncedSet(search); }, [search, debouncedSet]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const confirmDelete = async () => {
    try {
      await api.adminDeleteUser(deleting.id);
      toast.success('User deleted');
      setDeleting(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading || !stats) {
    return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-brand-500" />
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Admin Dashboard</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">System overview and user management.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} tone="brand" />
        <StatCard label="Total Transactions" value={stats.totalTransactions} icon={ArrowLeftRight} tone="warning" />
        <StatCard label="Total Income (all)" value={formatCurrency(stats.totalIncome, settings.currency)} icon={TrendingUp} tone="success" />
        <StatCard label="Total Expense (all)" value={formatCurrency(stats.totalExpense, settings.currency)} icon={TrendingDown} tone="error" />
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-xl bg-ink-100 dark:bg-ink-800/60 p-1">
        <button onClick={() => setTab('users')} className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${tab === 'users' ? 'bg-white text-brand-700 shadow-soft dark:bg-ink-900 dark:text-brand-300' : 'text-ink-500 dark:text-ink-400'}`}>Users</button>
        <button onClick={() => setTab('categories')} className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${tab === 'categories' ? 'bg-white text-brand-700 shadow-soft dark:bg-ink-900 dark:text-brand-300' : 'text-ink-500 dark:text-ink-400'}`}>Categories</button>
      </div>

      {tab === 'users' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-ink-100 dark:border-ink-800/70 px-5 py-4">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50">Users ({users.length})</h3>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="input pl-10 w-56" />
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50/70 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">Role</th>
                  <th className="px-5 py-3 font-semibold hidden md:table-cell">Joined</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-ink-100 dark:border-ink-800/60 hover:bg-ink-50/70 dark:hover:bg-ink-800/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} src={u.avatar} size="md" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink-900 dark:text-ink-50">{u.name}</p>
                          <p className="truncate text-xs text-ink-500 dark:text-ink-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell"><Badge variant={u.role === 'admin' ? 'info' : 'default'}>{u.role}</Badge></td>
                    <td className="px-5 py-3 hidden md:table-cell text-ink-500 dark:text-ink-400">{formatDate(u.createdAt, { short: true })}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setDeleting(u)}
                        disabled={u.role === 'admin'}
                        className="btn-ghost !p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 disabled:opacity-30 disabled:pointer-events-none"
                        title={u.role === 'admin' ? 'Admins cannot be deleted' : 'Delete user'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-ink-500">No users match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900 dark:text-ink-50">Income Categories</h3>
            <ul className="space-y-2">
              {INCOME_CATEGORIES.map((c) => (
                <li key={c} className="flex items-center justify-between rounded-lg border border-ink-100 dark:border-ink-800/70 px-3 py-2">
                  <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{c}</span>
                  <Badge variant="income">income</Badge>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900 dark:text-ink-50">Expense Categories</h3>
            <ul className="space-y-2">
              {EXPENSE_CATEGORIES.map((c) => (
                <li key={c} className="flex items-center justify-between rounded-lg border border-ink-100 dark:border-ink-800/70 px-3 py-2">
                  <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{c}</span>
                  <Badge variant="expense">expense</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete user?"
        message={`${deleting?.name} and all their transactions and budgets will be permanently removed.`}
        confirmText="Delete user"
      />
    </div>
  );
}
