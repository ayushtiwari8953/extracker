import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler, sendError } from '../utils/helpers.js';

export const stats = asyncHandler(async (_req, res) => {
  const [users, txns] = await Promise.all([User.countDocuments(), Transaction.countDocuments()]);
  const agg = await Transaction.aggregate([
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);
  const income = agg.find((a) => a._id === 'income')?.total || 0;
  const expense = agg.find((a) => a._id === 'expense')?.total || 0;
  res.json({ success: true, data: { totalUsers: users, totalTransactions: txns, totalIncome: income, totalExpense: expense } });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: { users } });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return sendError(res, 'User not found', 404);
  if (user.role === 'admin') return sendError(res, 'Cannot delete an admin user', 403);
  await Promise.all([User.findByIdAndDelete(req.params.id), Transaction.deleteMany({ user: req.params.id })]);
  res.json({ success: true, message: 'User deleted' });
});
