import Transaction from '../models/Transaction.js';
import { asyncHandler, sendError, paginate } from '../utils/helpers.js';

export const list = asyncHandler(async (req, res) => {
  const { search, type, category, from, to, sortBy = 'date', sortDir = 'desc', page, pageSize } = req.query;
  const filter = { user: req.user._id };
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
    ];
  }

  const { skip, limit, page: p, pageSize: size } = paginate({ page, pageSize });
  const sort = { [sortBy]: sortDir === 'asc' ? 1 : -1 };

  const [items, total] = await Promise.all([
    Transaction.find(filter).sort(sort).skip(skip).limit(limit),
    Transaction.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { items, total, page: p, pageSize: size, totalPages: Math.max(1, Math.ceil(total / size)) },
  });
});

export const create = asyncHandler(async (req, res) => {
  const { title, amount, type, category, date, notes } = req.body;
  const txn = await Transaction.create({ user: req.user._id, title, amount, type, category, date, notes });
  res.status(201).json({ success: true, data: { transaction: txn } });
});

export const update = asyncHandler(async (req, res) => {
  const txn = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!txn) return sendError(res, 'Transaction not found', 404);
  res.json({ success: true, data: { transaction: txn } });
});

export const remove = asyncHandler(async (req, res) => {
  const txn = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!txn) return sendError(res, 'Transaction not found', 404);
  res.json({ success: true, message: 'Transaction deleted' });
});

export const summary = asyncHandler(async (req, res) => {
  const stats = await Transaction.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
  const income = stats.find((s) => s._id === 'income')?.total || 0;
  const expense = stats.find((s) => s._id === 'expense')?.total || 0;
  res.json({ success: true, data: { income, expense, balance: income - expense } });
});
