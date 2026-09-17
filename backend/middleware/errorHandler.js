module.exports = function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: err.message || 'Validation error',
        details: err.errors
      }
    });
  }

  const status = err.status || 500;
  if (status === 500) {
    console.error('[CIS ERROR]', err);
  }

  res.status(status).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
};
