// Deterministic seed data so the demo feels alive on first load.
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, ROLE } from './constants';
import { uid } from './formatters';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9 + (n % 8), (n * 7) % 60, 0, 0);
  return d.toISOString();
}

export function seedTransactions(userId) {
  const items = [
    { title: 'Monthly Salary', amount: 85000, type: 'income', category: 'Salary', date: daysAgo(2), notes: 'October salary' },
    { title: 'Freelance Project', amount: 22000, type: 'income', category: 'Freelance', date: daysAgo(6), notes: 'Logo design' },
    { title: 'Dividend Payout', amount: 3200, type: 'income', category: 'Investment', date: daysAgo(12), notes: 'Index fund' },
    { title: 'Diwali Bonus', amount: 15000, type: 'income', category: 'Bonus', date: daysAgo(20), notes: 'Festive bonus' },
    { title: 'Groceries', amount: 2400, type: 'expense', category: 'Food', date: daysAgo(1), notes: 'BigBasket' },
    { title: 'Dinner with friends', amount: 1850, type: 'expense', category: 'Food', date: daysAgo(3), notes: 'Pizza night' },
    { title: 'Apartment Rent', amount: 18000, type: 'expense', category: 'Rent', date: daysAgo(4), notes: 'November rent' },
    { title: 'Electricity Bill', amount: 1450, type: 'expense', category: 'Bills', date: daysAgo(5), notes: 'MSEB' },
    { title: 'Internet Bill', amount: 999, type: 'expense', category: 'Bills', date: daysAgo(7), notes: 'Jio Fiber' },
    { title: 'Amazon Shopping', amount: 4990, type: 'expense', category: 'Shopping', date: daysAgo(8), notes: 'Winter jacket' },
    { title: 'Uber Rides', amount: 720, type: 'expense', category: 'Travel', date: daysAgo(9), notes: 'Airport' },
    { title: 'Petrol', amount: 2000, type: 'expense', category: 'Fuel', date: daysAgo(10), notes: 'Tank full' },
    { title: 'Udemy Course', amount: 649, type: 'expense', category: 'Education', date: daysAgo(11), notes: 'Advanced JS' },
    { title: 'Movie Night', amount: 800, type: 'expense', category: 'Entertainment', date: daysAgo(13), notes: 'IMAX' },
    { title: 'Gym Membership', amount: 1500, type: 'expense', category: 'Healthcare', date: daysAgo(15), notes: 'Monthly' },
    { title: 'Phone Recharge', amount: 399, type: 'expense', category: 'Bills', date: daysAgo(16), notes: 'Prepaid' },
    { title: 'Restaurant', amount: 1250, type: 'expense', category: 'Food', date: daysAgo(18), notes: 'Anniversary' },
    { title: 'Books', amount: 980, type: 'expense', category: 'Education', date: daysAgo(22), notes: 'Two novels' },
    { title: 'Train Tickets', amount: 1600, type: 'expense', category: 'Travel', date: daysAgo(25), notes: 'Weekend trip' },
    { title: 'Pharmacy', amount: 540, type: 'expense', category: 'Healthcare', date: daysAgo(28), notes: 'Vitamins' },
  ];
  return items.map((t, i) => ({
    id: uid('txn'),
    userId,
    ...t,
    createdAt: daysAgo(30 - i),
    updatedAt: daysAgo(30 - i),
  }));
}

export function seedBudgets(userId) {
  const now = new Date();
  return [
    {
      id: uid('bud'),
      userId,
      month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      amount: 40000,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
}

export function seedAdminUser() {
  return {
    id: 'usr_admin_demo',
    name: 'Aarav Admin',
    email: 'admin@fintrack.app',
    password: 'admin123',
    role: ROLE.ADMIN,
    avatar: null,
    createdAt: new Date('2024-01-01').toISOString(),
  };
}

export function seedDemoUser() {
  return {
    id: 'usr_demo_001',
    name: 'Riya Sharma',
    email: 'demo@fintrack.app',
    password: 'demo123',
    role: ROLE.USER,
    avatar: null,
    createdAt: new Date('2024-06-12').toISOString(),
  };
}

export { INCOME_CATEGORIES, EXPENSE_CATEGORIES };
