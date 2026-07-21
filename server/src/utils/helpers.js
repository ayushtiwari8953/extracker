export function sendSuccess(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendError(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function paginate({ page = 1, pageSize = 10 }) {
  const p = Math.max(1, Number(page) || 1);
  const size = Math.min(100, Math.max(1, Number(pageSize) || 10));
  return { skip: (p - 1) * size, limit: size, page: p, pageSize: size };
}
