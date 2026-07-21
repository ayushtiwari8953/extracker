import User from '../models/User.js';
import { signToken, signResetToken } from '../middleware/auth.js';
import { asyncHandler, sendError } from '../utils/helpers.js';
import { sendResetEmail } from '../utils/mailer.js';
import { config } from '../config/index.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return sendError(res, 'An account with this email already exists', 409);

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ success: true, data: { token, user } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return sendError(res, 'No account found with this email', 404);
  const match = await user.matchPassword(password);
  if (!match) return sendError(res, 'Incorrect password', 401);

  const token = signToken(user._id);
  res.json({ success: true, data: { token, user } });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // Always respond 200 to avoid email enumeration.
  if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

  const resetToken = signResetToken(user._id);
  user.resetToken = resetToken;
  user.resetExpires = Date.now() + 30 * 60 * 1000;
  await user.save();

  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
  await sendResetEmail(user.email, resetUrl);

  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } });
  if (!user) return sendError(res, 'Invalid or expired reset token', 400);

  user.password = password;
  user.resetToken = null;
  user.resetExpires = null;
  await user.save();

  res.json({ success: true, message: 'Password updated. You can sign in now.' });
});
