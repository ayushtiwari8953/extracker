import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { config } from '../config/index.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Category from '../models/Category.js';

const INCOME = ['Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Other'];
const EXPENSE = ['Food', 'Shopping', 'Rent', 'Bills', 'Travel', 'Fuel', 'Education', 'Entertainment', 'Healthcare', 'Other'];
const COLORS = ['#10b981', '#06b6d4', '#3366ff', '#8b5cf6', '#f59e0b', '#64748b', '#f97316', '#ec4899', '#6366f1', '#ef4444', '#14b8a6', '#a3a300', '#0ea5e9', '#d946ef', '#22c55e'];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function run() {
  await connectDB();
  console.log('Seeding…');

  await Promise.all([
    User.deleteMany({ email: { $ne: 'admin@fintrack.app' } }),
    Transaction.deleteMany({}),
    Budget.deleteMany({}),
    Category.deleteMany({}),
  ]);

  let admin = await User.findOne({ email: 'admin@fintrack.app' });
  if (!admin) admin = await User.create({ name: 'Aarav Admin', email: 'admin@fintrack.app', password: 'admin123', role: 'admin' });

  const demo = await User.create({ name: 'Riya Sharma', email: 'demo@fintrack.app', password: 'demo123' });

  const cats = [...INCOME.map((n, i) => ({ name: n, type: 'income', color: COLORS[i % COLORS.length], isDefault: true })),
    ...EXPENSE.map((n, i) => ({ name: n, type: 'expense', color: COLORS[(i + 6) % COLORS.length], isDefault: true }))];
  await Category.insertMany(cats);

  const txns = [
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
  ].map((t) => ({ ...t, user: demo._id }));

  await Transaction.insertMany(txns);

  const now = new Date();
  await Budget.create({
    user: demo._id,
    month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    amount: 40000,
  });

  console.log('✓ Seed complete');
  console.log('  Admin: admin@fintrack.app / admin123');
  console.log('  User:  demo@fintrack.app / demo123');
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
