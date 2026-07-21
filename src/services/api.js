import { store, makeToken, newId } from './store';
import { sleep, uid } from '../utils/formatters';
import { ROLE } from '../utils/constants';

store.ensureSeeded();

function ApiError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function ok(data, delay = 250) {
  await sleep(delay);
  return data;
}

function hashPassword(pw) {
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (h * 31 + pw.charCodeAt(i)) >>> 0;
  return `h${h.toString(36)}`;
}

function verifyPassword(pw, hash) {
  return hashPassword(pw) === hash;
}

export const api = {
  // ---------- Auth ----------
  async register({ name, email, password }) {
    const existing = store.users.findByEmail(email);
    if (existing) throw ApiError('An account with this email already exists', 409);
    const user = {
      id: newId('usr'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashPassword(password),
      role: ROLE.USER,
      avatar: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const pub = store.users.create(user);
    const token = makeToken(user.id);
    store.session.set(token, pub, true);
    return ok({ token, user: pub });
  },

  async login({ email, password, remember }) {
    const user = store.users.raw().find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw ApiError('No account found with this email', 404);
    if (!verifyPassword(password, user.password)) throw ApiError('Incorrect password', 401);
    const pub = publicUser(user);
    const token = makeToken(user.id);
    store.session.set(token, pub, remember);
    return ok({ token, user: pub });
  },

  async logout() {
    store.session.clear();
    return ok({ success: true });
  },

  async me() {
    const { user } = store.session.get();
    if (!user) throw ApiError('Not authenticated', 401);
    const fresh = store.users.findById(user.id);
    return ok(fresh);
  },

  async forgotPassword({ email }) {
    const user = store.users.findByEmail(email);
  
    const resetToken = user ? uid('rst') : null;
    if (user) {
      store.users.update(user.id, { resetToken, resetExpires: Date.now() + 1000 * 60 * 30 });
    }
    return ok({ message: 'If that email exists, a reset link has been sent.', resetToken });
  },

  async resetPassword({ token, password }) {
    const users = store.users.raw();
    const idx = users.findIndex((u) => u.resetToken === token && u.resetExpires > Date.now());
    if (idx === -1) throw ApiError('Invalid or expired reset token', 400);
    store.users.update(users[idx].id, {
      password: hashPassword(password),
      resetToken: null,
      resetExpires: null,
    });
    return ok({ message: 'Password updated. You can sign in now.' });
  },

  // ---------- Profile ----------
  async updateProfile(userId, patch) {
    if (patch.email) {
      const existing = store.users.raw().find((u) => u.email.toLowerCase() === patch.email.toLowerCase() && u.id !== userId);
      if (existing) throw ApiError('That email is already in use', 409);
      patch.email = patch.email.toLowerCase();
    }
    const updated = store.users.update(userId, patch);
    const { user } = store.session.get();
    if (user && user.id === userId) store.session.set(localStorage.getItem('fintrack.token'), updated, true);
    return ok(updated);
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = store.users.raw().find((u) => u.id === userId);
    if (!user) throw ApiError('User not found', 404);
    if (!verifyPassword(currentPassword, user.password)) throw ApiError('Current password is incorrect', 401);
    store.users.update(userId, { password: hashPassword(newPassword) });
    return ok({ message: 'Password changed successfully' });
  },

  async uploadAvatar(userId, dataUrl) {
    return ok(store.users.update(userId, { avatar: dataUrl }));
  },

  
  async listTransactions(userId, params = {}) {
    let items = store.transactions.forUser(userId);
    const {
      search, type, category, from, to, sortBy = 'date', sortDir = 'desc', page = 1, pageSize = 10,
    } = params;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((t) => t.title.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q));
    }
    if (type) items = items.filter((t) => t.type === type);
    if (category) items = items.filter((t) => t.category === category);
    if (from) items = items.filter((t) => new Date(t.date) >= new Date(from));
    if (to) items = items.filter((t) => new Date(t.date) <= new Date(to));
    items = items.sort((a, b) => {
      let av, bv;
      if (sortBy === 'amount') { av = a.amount; bv = b.amount; }
      else if (sortBy === 'title') { av = a.title.toLowerCase(); bv = b.title.toLowerCase(); }
      else { av = new Date(a.date).getTime(); bv = new Date(b.date).getTime(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);
    return ok({ items: paged, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  },

  async createTransaction(userId, data) {
    const txn = {
      id: newId('txn'),
      userId,
      title: data.title.trim(),
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      date: data.date,
      notes: (data.notes || '').trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return ok(store.transactions.create(txn));
  },

  async updateTransaction(userId, id, patch) {
    const txn = store.transactions.forUser(userId).find((t) => t.id === id);
    if (!txn) throw ApiError('Transaction not found', 404);
    return ok(store.transactions.update(id, patch));
  },

  async deleteTransaction(userId, id) {
    const txn = store.transactions.forUser(userId).find((t) => t.id === id);
    if (!txn) throw ApiError('Transaction not found', 404);
    store.transactions.remove(id);
    return ok({ success: true });
  },

  // ---------- Budgets ----------
  async listBudgets(userId) {
    return ok(store.budgets.forUser(userId));
  },

  async createBudget(userId, data) {
    const existing = store.budgets.forUser(userId).find((b) => b.month === data.month);
    if (existing) throw ApiError('A budget already exists for this month', 409);
    const budget = {
      id: newId('bud'),
      userId,
      month: data.month,
      amount: Number(data.amount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return ok(store.budgets.create(budget));
  },

  async updateBudget(userId, id, patch) {
    const b = store.budgets.forUser(userId).find((x) => x.id === id);
    if (!b) throw ApiError('Budget not found', 404);
    return ok(store.budgets.update(id, patch));
  },

  async deleteBudget(userId, id) {
    const b = store.budgets.forUser(userId).find((x) => x.id === id);
    if (!b) throw ApiError('Budget not found', 404);
    store.budgets.remove(id);
    return ok({ success: true });
  },

  // ---------- Settings ----------
  async getSettings(userId) {
    return ok(store.settings.get(userId));
  },

  async updateSettings(userId, patch) {
    return ok(store.settings.set(userId, patch));
  },

  // ---------- Admin ----------
  async adminStats() {
    const users = store.users.all();
    const txns = store.transactions.all();
    const totalIncome = txns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = txns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return ok({
      totalUsers: users.length,
      totalTransactions: txns.length,
      totalIncome,
      totalExpense,
      admins: store.users.admins(),
      recentUsers: users.slice(-5).reverse(),
      byRole: {
        admin: users.filter((u) => u.role === ROLE.ADMIN).length,
        user: users.filter((u) => u.role === ROLE.USER).length,
      },
    });
  },

  async adminListUsers() {
    return ok(store.users.all());
  },

  async adminDeleteUser(id) {
    if (id === 'usr_admin_demo') throw ApiError('Cannot delete the primary admin', 403);
    store.users.remove(id);
    return ok({ success: true });
  },

  async adminUpdateUser(id, patch) {
    return ok(store.users.update(id, patch));
  },
};

function publicUser(u) {
  if (!u) return null;
  const { password, resetToken, resetExpires, ...rest } = u;
  return rest;
}
