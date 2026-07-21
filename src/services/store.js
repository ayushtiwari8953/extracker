// localStorage-backed store. In production this is replaced by the Express/MongoDB API.
import { STORAGE_KEYS, ROLE } from '../utils/constants';
import { uid } from '../utils/formatters';
import { seedAdminUser, seedDemoUser, seedTransactions, seedBudgets } from '../utils/seed';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  let users = read(STORAGE_KEYS.USERS, null);
  if (!users) {
    const admin = seedAdminUser();
    const demo = seedDemoUser();
    users = [admin, demo];
    write(STORAGE_KEYS.USERS, users);

    const txns = seedTransactions(demo.id);
    write(STORAGE_KEYS.TRANSACTIONS, txns);

    const budgets = seedBudgets(demo.id);
    write(STORAGE_KEYS.BUDGETS, budgets);
  }
}

function publicUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

export const store = {
  read,
  write,
  ensureSeeded,
  users: {
    all: () => read(STORAGE_KEYS.USERS, []).map(publicUser),
    raw: () => read(STORAGE_KEYS.USERS, []),
    findByEmail: (email) => read(STORAGE_KEYS.USERS, []).find((u) => u.email.toLowerCase() === email.toLowerCase()),
    findById: (id) => publicUser(read(STORAGE_KEYS.USERS, []).find((u) => u.id === id)),
    create: (user) => {
      const users = read(STORAGE_KEYS.USERS, []);
      users.push(user);
      write(STORAGE_KEYS.USERS, users);
      return publicUser(user);
    },
    update: (id, patch) => {
      const users = read(STORAGE_KEYS.USERS, []);
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...patch, updatedAt: new Date().toISOString() };
      write(STORAGE_KEYS.USERS, users);
      return publicUser(users[idx]);
    },
    remove: (id) => {
      const users = read(STORAGE_KEYS.USERS, []).filter((u) => u.id !== id);
      write(STORAGE_KEYS.USERS, users);
      const txns = read(STORAGE_KEYS.TRANSACTIONS, []).filter((t) => t.userId !== id);
      write(STORAGE_KEYS.TRANSACTIONS, txns);
      const budgets = read(STORAGE_KEYS.BUDGETS, []).filter((b) => b.userId !== id);
      write(STORAGE_KEYS.BUDGETS, budgets);
    },
    count: () => read(STORAGE_KEYS.USERS, []).length,
    admins: () => read(STORAGE_KEYS.USERS, []).filter((u) => u.role === ROLE.ADMIN).length,
  },
  transactions: {
    all: () => read(STORAGE_KEYS.TRANSACTIONS, []),
    forUser: (userId) => read(STORAGE_KEYS.TRANSACTIONS, []).filter((t) => t.userId === userId),
    create: (txn) => {
      const txns = read(STORAGE_KEYS.TRANSACTIONS, []);
      txns.push(txn);
      write(STORAGE_KEYS.TRANSACTIONS, txns);
      return txn;
    },
    update: (id, patch) => {
      const txns = read(STORAGE_KEYS.TRANSACTIONS, []);
      const idx = txns.findIndex((t) => t.id === id);
      if (idx === -1) return null;
      txns[idx] = { ...txns[idx], ...patch, updatedAt: new Date().toISOString() };
      write(STORAGE_KEYS.TRANSACTIONS, txns);
      return txns[idx];
    },
    remove: (id) => {
      const txns = read(STORAGE_KEYS.TRANSACTIONS, []).filter((t) => t.id !== id);
      write(STORAGE_KEYS.TRANSACTIONS, txns);
    },
  },
  budgets: {
    all: () => read(STORAGE_KEYS.BUDGETS, []),
    forUser: (userId) => read(STORAGE_KEYS.BUDGETS, []).filter((b) => b.userId === userId),
    create: (b) => {
      const budgets = read(STORAGE_KEYS.BUDGETS, []);
      budgets.push(b);
      write(STORAGE_KEYS.BUDGETS, budgets);
      return b;
    },
    update: (id, patch) => {
      const budgets = read(STORAGE_KEYS.BUDGETS, []);
      const idx = budgets.findIndex((b) => b.id === id);
      if (idx === -1) return null;
      budgets[idx] = { ...budgets[idx], ...patch, updatedAt: new Date().toISOString() };
      write(STORAGE_KEYS.BUDGETS, budgets);
      return budgets[idx];
    },
    remove: (id) => {
      const budgets = read(STORAGE_KEYS.BUDGETS, []).filter((b) => b.id !== id);
      write(STORAGE_KEYS.BUDGETS, budgets);
    },
  },
  settings: {
    get: (userId) => {
      const all = read(STORAGE_KEYS.SETTINGS, {});
      return (
        all[userId] || {
          currency: 'INR',
          theme: 'light',
          notifications: true,
          lowBalanceAlerts: true,
        }
      );
    },
    set: (userId, patch) => {
      const all = read(STORAGE_KEYS.SETTINGS, {});
      all[userId] = { ...(all[userId] || {}), ...patch };
      write(STORAGE_KEYS.SETTINGS, all);
      return all[userId];
    },
  },
  session: {
    get: () => ({
      token: localStorage.getItem(STORAGE_KEYS.TOKEN),
      user: read(STORAGE_KEYS.CURRENT_USER, null),
      remember: localStorage.getItem(STORAGE_KEYS.REMEMBER) === '1',
    }),
    set: (token, user, remember) => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      write(STORAGE_KEYS.CURRENT_USER, user);
      localStorage.setItem(STORAGE_KEYS.REMEMBER, remember ? '1' : '0');
    },
    clear: () => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER);
    },
  },
};

export function makeToken(userId) {
  // Demo-only token. Real backend signs a JWT with jsonwebtoken.
  return btoa(`${userId}:${Date.now()}:${Math.random().toString(36).slice(2)}`);
}

export function newId(prefix) {
  return uid(prefix);
}
