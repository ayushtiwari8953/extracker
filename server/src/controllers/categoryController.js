import Category from '../models/Category.js';
import { asyncHandler, sendError } from '../utils/helpers.js';

export const list = asyncHandler(async (req, res) => {
  const items = await Category.find({ $or: [{ user: null }, { user: req.user._id }] });
  res.json({ success: true, data: { categories: items } });
});

export const create = asyncHandler(async (req, res) => {
  const { name, type, color, icon } = req.body;
  const cat = await Category.create({ name, type, color, icon, user: req.user._id });
  res.status(201).json({ success: true, data: { category: cat } });
});

export const remove = asyncHandler(async (req, res) => {
  const cat = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id, isDefault: false });
  if (!cat) return sendError(res, 'Category not found or cannot be deleted', 404);
  res.json({ success: true, message: 'Category deleted' });
});
