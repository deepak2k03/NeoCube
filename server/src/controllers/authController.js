const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      // Default avatar and role (defaults to 'user')
      avatar: { type: 'preset', presetOption: 'avatar1', color: '#3b82f6' }
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: { 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          avatar: user.avatar,
          // 🔥 CRITICAL FIX: Send role so frontend knows if this is an admin
          role: user.role, 
          progress: user.progress || []
        } 
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Select password because it's usually excluded in the model
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: { 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          avatar: user.avatar,
          // 🔥 CRITICAL FIX: This field enables the Admin Route to work
          role: user.role,
          progress: user.progress 
        } 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    // Populate progress details for the dashboard
    const user = await User.findById(req.user._id).populate('progress.technology');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};