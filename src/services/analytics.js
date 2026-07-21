// Pure functions that derive analytics from a transaction list.
import { monthKey, monthLabel, isSameMonth } from '../utils/formatters';
import { MONTH_NAMES } from '../utils/constants';

export function totals(transactions) {
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return {
    income,
    expense,
    balance: income - expense,
    savings: income - expense,
    savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
  };
}

export function monthlyTotals(transactions, monthsBack = 6) {
  const now = new Date();
  const buckets = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(d);
    buckets.push({ key, label: MONTH_NAMES[d.getMonth()], income: 0, expense: 0 });
  }
  for (const t of transactions) {
    const key = monthKey(t.date);
    const b = buckets.find((x) => x.key === key);
    if (b) {
      if (t.type === 'income') b.income += t.amount;
      else b.expense += t.amount;
    }
  }
  return buckets;
}

export function categoryBreakdown(transactions, type = 'expense') {
  const map = {};
  for (const t of transactions) {
    if (t.type !== type) continue;
    map[t.category] = (map[t.category] || 0) + t.amount;
  }
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function weeklyTotals(transactions, year, month) {
  // month is 0-indexed
  const weeks = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  let cur = new Date(first);
  cur.setDate(cur.getDate() - cur.getDay());
  while (cur <= last) {
    const start = new Date(cur);
    const end = new Date(cur);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    const label = `W${weeks.length + 1}`;
    let income = 0, expense = 0;
    for (const t of transactions) {
      const d = new Date(t.date);
      if (d >= start && d <= end) {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
      }
    }
    weeks.push({ label, income, expense });
    cur.setDate(cur.getDate() + 7);
  }
  return weeks;
}

export function yearlyTotals(transactions, yearsBack = 3) {
  const now = new Date();
  const buckets = [];
  for (let i = yearsBack - 1; i >= 0; i--) {
    const y = now.getFullYear() - i;
    buckets.push({ year: String(y), income: 0, expense: 0 });
  }
  for (const t of transactions) {
    const y = String(new Date(t.date).getFullYear());
    const b = buckets.find((x) => x.year === y);
    if (b) {
      if (t.type === 'income') b.income += t.amount;
      else b.expense += t.amount;
    }
  }
  return buckets;
}

export function highest(transactions, type = 'expense') {
  const list = transactions.filter((t) => t.type === type);
  if (!list.length) return null;
  return list.reduce((max, t) => (t.amount > max.amount ? t : max), list[0]);
}

export function insights(transactions, budget) {
  const t = totals(transactions);
  const out = [];
  if (t.savingsRate >= 20) out.push({ tone: 'success', text: `You're saving ${t.savingsRate.toFixed(0)}% of your income — great pace.` });
  else if (t.savingsRate > 0) out.push({ tone: 'warning', text: `Savings rate is ${t.savingsRate.toFixed(0)}%. Aim for 20%+.`, });
  else out.push({ tone: 'error', text: 'You spent more than you earned this period.' });

  const exp = categoryBreakdown(transactions, 'expense');
  if (exp.length) {
    const top = exp[0];
    out.push({ tone: 'info', text: `${top.category} is your largest expense category (${((top.amount / (t.expense || 1)) * 100).toFixed(0)}%).` });
  }
  if (budget && t.expense) {
    const pct = (t.expense / budget.amount) * 100;
    if (pct >= 100) out.push({ tone: 'error', text: `You've exceeded your ${monthLabel(budget.month)} budget.` });
    else if (pct >= 80) out.push({ tone: 'warning', text: `You've used ${pct.toFixed(0)}% of your monthly budget.` });
    else out.push({ tone: 'success', text: `You're within budget — ${pct.toFixed(0)}% used this month.` });
  }
  return out;
}
