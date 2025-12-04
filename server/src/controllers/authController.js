const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const Analytics = require('../models/Analytics');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, interests, experienceLevel } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      interests: interests || [],
      experienceLevel: experienceLevel || 'Beginner'
    });

    // Generate token
    const token = generateToken({ id: user._id });

    // Record analytics (temporarily disabled because technologyId is required in Analytics model)
    // await Analytics.recordAction(user._id, null, 'start');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          interests: user.interests,
          experienceLevel: user.experienceLevel,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken({ id: user._id });

    // Record analytics (temporarily disabled because technologyId is required in Analytics model)
    // await Analytics.recordAction(user._id, null, 'start');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          interests: user.interests,
          experienceLevel: user.experienceLevel,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          interests: user.interests,
          experienceLevel: user.experienceLevel,
          favourites: user.favourites,
          progress: user.progress,
          streak: user.streak,
          totalHoursSpent: user.totalHoursSpent,
          level: user.level,
          stats: user.getStats(),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
