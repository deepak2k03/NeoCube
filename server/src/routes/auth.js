const express = require('express');
const { validationRules, handleValidationErrors } = require('../utils/validators');
// ❌ remove authLimiter import for now
// const { authLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ❌ no rate limiting on auth routes during development / testing
// if (process.env.NODE_ENV === 'production') {
//   router.use(authLimiter);
// }

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  validationRules.register,
  handleValidationErrors,
  authController.register
);

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  validationRules.login,
  handleValidationErrors,
  authController.login
);

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, authController.getMe);

module.exports = router;
