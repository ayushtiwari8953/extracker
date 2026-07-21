import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler, sendError } from '../utils/helpers.js';

export const list = asyncHandler(async (req, res) => {
  const items = await Budget.find({ user: req.user._id }).sort({ month: -1 });
  res.json({ success: true, data: { budgets: items } });
});

export const create = asyncHandler(async (req, res) => {
  const { month, amount } = req.body;
  const exists = await Budget.findOne({ user: req.user._id, month });
  if (exists) return sendError(res, 'A budget already exists for this month', 409);
  const budget = await Budget.create({ user: req.user._id, month, amount });
  res.status(201).json({ success: true, data: { budget } });
});

export const update = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!budget) return sendError(res, 'Budget not found', 404);
  res.json({ success: true, data: { budget } });
});

export const remove = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) return sendError(res, 'Budget not found', 404);
  res.json({ success: true, message: 'Budget deleted' });
});

export const status = asyncHandler(async (req, res) => {
  const { month } = req.params;
  const budget = await Budget.findOne({ user: req.user._id, month });
  if (!budget) return sendError(res, 'No budget for this month', 404);
  const [y, m] = month.split('-').map(Number);
  const spent = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        date: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const used = spent[0]?.total || 0;
  res.json({
    success: true,
    data: { budget: budget.amount, used, remaining: budget.amount - used, pct: (used / budget.amount) * 100 },
  });
});
