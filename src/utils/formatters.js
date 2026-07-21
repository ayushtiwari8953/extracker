import { CURRENCY_SYMBOLS, MONTH_NAMES, MONTH_NAMES_FULL } from './constants';

export function formatCurrency(amount, currency = 'INR', opts = {}) {
  const { withSymbol = true, compact = false } = opts;
  const symbol = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.INR;
  const value = Number(amount) || 0;
  const abs = Math.abs(value);
  let body;
  if (compact) {
    if (abs >= 1_000_000) body = (value / 1_000_000).toFixed(1) + 'M';
    else if (abs >= 1_000) body = (value / 1_000).toFixed(1) + 'k';
    else body = value.toFixed(0);
  } else {
    body = value.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  return withSymbol ? `${symbol}${body}` : body;
}

export function formatDate(date, opts = {}) {
  const { withYear = true, short = false } = opts;
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  const day = d.getDate();
  const month = short ? MONTH_NAMES[d.getMonth()] : MONTH_NAMES_FULL[d.getMonth()];
  return withYear ? `${day} ${month} ${d.getFullYear()}` : `${day} ${month}`;
}

export function formatRelative(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(d, { short: true });
}

export function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

export function startOfMonth(date = new Date()) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(date = new Date()) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function isSameMonth(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth();
}

export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export function getWeeksInMonth(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const weeks = [];
  let cur = new Date(first);
  cur.setDate(cur.getDate() - cur.getDay());
  while (cur <= last) {
    const start = new Date(cur);
    const end = new Date(cur);
    end.setDate(end.getDate() + 6);
    weeks.push({ start, end });
    cur.setDate(cur.getDate() + 7);
  }
  return weeks;
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function sum(arr, key) {
  return arr.reduce((acc, item) => acc + (key ? Number(item[key]) || 0 : Number(item) || 0), 0);
}

export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}

export function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function downloadFile(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}
