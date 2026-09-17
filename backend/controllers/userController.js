import User from '../models/User.js';
import Stakeholder from '../models/Stakeholder.js';

/**
 * @route GET /api/v1/users
 * @desc Get all registered user accounts (Admin only)
 */
export const getUsers = async (req, res) => {
  const users = await User.find()
    .select('-password')
    .populate('stakeholder')
    .sort({ createdAt: -1 });

  res.json({ users });
};

/**
 * @route POST /api/v1/users
 * @desc Create a new user account with assigned role (Admin only)
 */
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      error: { message: 'Please provide name, email, password, and role.' }
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return res.status(400).json({
      error: { message: 'A user with this email address already exists.' }
    });
  }

  const normalizedRole = role.toLowerCase().trim();

  // Determine system access role and stakeholder role
  let systemRole = 'stakeholder';
  let stakeholderRole = normalizedRole;

  if (normalizedRole === 'client') {
    systemRole = 'client';
    stakeholderRole = 'client';
  } else if (normalizedRole === 'admin' || normalizedRole === 'project manager') {
    systemRole = 'admin';
    stakeholderRole = 'project manager';
  } else if (normalizedRole === 'designer') {
    stakeholderRole = 'interior designer';
  }

  // Create or reuse matching Stakeholder
  let stakeholder = await Stakeholder.findOne({ 'contact.email': email.toLowerCase().trim() });
  if (!stakeholder) {
    stakeholder = await Stakeholder.create({
      name,
      role: stakeholderRole,
      contact: { email: email.toLowerCase().trim() }
    });
  }

  // Create User Account
  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password,
    role: systemRole,
    stakeholder: stakeholder._id
  });

  const populatedUser = await User.findById(user._id)
    .select('-password')
    .populate('stakeholder');

  res.status(201).json({
    user: populatedUser,
    message: `User '${name}' created successfully with role '${stakeholderRole}'`
  });
};

/**
 * @route DELETE /api/v1/users/:id
 * @desc Remove/Delete a user account (Admin only)
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() === id) {
    return res.status(400).json({
      error: { message: 'Cannot delete your active logged-in admin account.' }
    });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      error: { message: 'User account not found.' }
    });
  }

  await User.findByIdAndDelete(id);

  res.json({
    success: true,
    message: `User account '${user.name}' (${user.email}) has been removed.`
  });
};
