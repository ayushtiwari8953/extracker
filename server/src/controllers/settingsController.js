import Settings from '../models/Settings.js';
import { asyncHandler } from '../utils/helpers.js';

export const get = asyncHandler(async (req, res) => {
  let s = await Settings.findOne({ user: req.user._id });
  if (!s) s = await Settings.create({ user: req.user._id });
  res.json({ success: true, data: { settings: s } });
});

export const update = asyncHandler(async (req, res) => {
  const { currency, theme, notifications, lowBalanceAlerts } = req.body;
  const s = await Settings.findOneAndUpdate(
    { user: req.user._id },
    { $set: { currency, theme, notifications, lowBalanceAlerts } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json({ success: true, data: { settings: s } });
});
