const express = require('express');
const { validationRules, handleValidationErrors } = require('../utils/validators');
// const { authLimiter } = require('../middleware/rateLimiter'); // Commented out as per your file
const authController = require('../controllers/authController');

// 👇 FIX: Import 'protect' instead of 'authenticate'
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

// ✅ LOGIN 
router.post(
  '/login',
  validationRules.login,
  handleValidationErrors,
  authController.login
);

// ✅ ME (Use 'protect' here to match the import)
router.get('/me', protect, authController.getMe);

// ✅ REGISTER 
router.post('/register', authController.register);

module.exports = router;