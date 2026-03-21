const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message, code: 'VALIDATION_ERROR' });
  }
  // Invalid ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format', code: 'CAST_ERROR' });
  }
  // Duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ success: false, error: 'Duplicate entry — resource already exists', code: 'DUPLICATE_KEY' });
  }
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Token expired — please login again', code: 'TOKEN_EXPIRED' });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
};

export default errorHandler;
