export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  if (process.env.NODE_ENV !== 'production' && status === 500) console.error(err);
  res.status(status).json({ message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
}
