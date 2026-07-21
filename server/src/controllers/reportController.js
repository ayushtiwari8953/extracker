import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../utils/helpers.js';

export const monthly = asyncHandler(async (req, res) => {
  const { year, month } = req.params;
  const [y, m] = [Number(year), Number(month)];
  const items = await Transaction.find({
    user: req.user._id,
    date: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) },
  }).sort({ date: -1 });

  const income = items.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = items.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  res.json({ success: true, data: { income, expense, net: income - expense, transactions: items } });
});

export const annual = asyncHandler(async (req, res) => {
  const y = Number(req.params.year);
  const items = await Transaction.find({
    user: req.user._id,
    date: { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) },
  }).sort({ date: -1 });

  const income = items.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = items.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  res.json({ success: true, data: { income, expense, net: income - expense, transactions: items } });
});
