import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { isDbConnected } from '../config/db.js';
import User from '../models/User.js';

// Mock users when no DB
const mockUsers = [
  { _id: 'admin1', name: 'CX360 Admin', email: 'admin@cx360.com', password: 'Admin@CX360#1', role: 'admin', isActive: true },
  { _id: 'mgr1', name: 'CX360 Manager', email: 'manager@cx360.com', password: 'Manager@CX360#1', role: 'manager', isActive: true },
];

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    let user;

    if (isDbConnected()) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      const valid = await user.comparePassword(password);
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Mock mode
      user = mockUsers.find(u => u.email === email.toLowerCase() && u.password === password);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getMe(req, res) {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
}
