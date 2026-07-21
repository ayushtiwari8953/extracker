import User from '../models/User.js';
import { asyncHandler, sendError } from '../utils/helpers.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (email && email !== req.user.email) {
    const exists = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (exists) return sendError(res, 'That email is already in use', 409);
  }
  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: name || req.user.name, email: email || req.user.email } },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: { user: updated } });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const match = await user.matchPassword(currentPassword);
  if (!match) return sendError(res, 'Current password is incorrect', 401);

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully' });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return sendError(res, 'No image uploaded', 400);
  const url = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user._id, { $set: { avatar: url } }, { new: true });
  res.json({ success: true, data: { user } });
});
