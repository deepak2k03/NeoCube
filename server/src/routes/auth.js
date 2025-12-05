const express = require('express');
const { validationRules, handleValidationErrors } = require('../utils/validators');
const { authLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ❌ TEMP: remove authLimiter for auth routes completely
// if (process.env.NODE_ENV === 'production') {
//   router.use(authLimiter);
// }

// ✅ LOGIN – keep as is
router.post(
  '/login',
  validationRules.login,
  handleValidationErrors,
  authController.login
);

// ✅ ME – keep as is
router.get('/me', authenticate, authController.getMe);

// ✅ REGISTER – TEMP: remove validators, call controller directly
router.post('/register', authController.register);

module.exports = router;
