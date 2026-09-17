import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cis_secret_key_12345';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: { message: 'Not authorized, no token provided' } });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password').populate('stakeholder');

    if (!req.user) {
      return res.status(401).json({ error: { message: 'Not authorized, user not found' } });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: { message: 'Not authorized, token verification failed' } });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: { message: `User role '${req.user?.role}' is not authorized to access this resource` }
      });
    }
    next();
  };
};

export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};
