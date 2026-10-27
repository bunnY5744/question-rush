function notFound(req, res) { res.status(404).json({ error: 'Not found', path: req.originalUrl }); }
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[error]', err && err.message ? err.message : err);
  if (err && err.type === 'entity.too.large') return res.status(413).json({ error: 'Request payload too large' });
  const status = err.status || 500;
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message });
}
module.exports = { notFound, errorHandler };
