import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  const { name, email, password, role, stakeholder } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: { message: 'Missing required fields: name, email, and password are required' }
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      error: { message: 'User with this email already exists' }
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'stakeholder',
    stakeholder: stakeholder || null
  });

  const populatedUser = await User.findById(user._id).select('-password').populate('stakeholder');
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: populatedUser
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: { message: 'Missing email or password' }
    });
  }

  const user = await User.findOne({ email }).populate('stakeholder');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      error: { message: 'Invalid email or password' }
    });
  }

  const token = generateToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  res.json({
    token,
    user: userObj
  });
};

export const demoLogin = async (req, res) => {
  const { email, role } = req.body;

  let user;
  if (email) {
    user = await User.findOne({ email }).populate('stakeholder');
  } else if (role) {
    user = await User.findOne({ role }).populate('stakeholder');
  }

  if (!user) {
    return res.status(404).json({
      error: { message: 'Demo user account not found. Please run backend seed script.' }
    });
  }

  const token = generateToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  res.json({
    token,
    user: userObj
  });
};

export const getMe = async (req, res) => {
  res.json({
    user: req.user
  });
};
