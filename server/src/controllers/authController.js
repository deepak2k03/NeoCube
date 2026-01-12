const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Using 'username' to match Model

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken({ id: user._id });

    res.status(201).json({
      success: true,
      token,
      data: { user: { id: user._id, username: user.username, email: user.email } }
    });
  } catch (error) {
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

    // Use .select('+password') because the Model excludes it by default
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // This now matches the name defined in your User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id });

    res.status(200).json({
      success: true,
      token,
      data: { user: { id: user._id, username: user.username, email: user.email } }
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
    // Populate progress with technology details for the frontend dashboard
    const user = await User.findById(req.user._id).populate('progress.technology');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};