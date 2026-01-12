const express = require('express');
const { validationRules, handleValidationErrors } = require('../utils/validators');
const userController = require('../controllers/userController');

// 👇 FIX: Change 'authenticate' to 'protect' to match your middleware file
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes require authentication
// 👇 FIX: Use the correct variable name here too
router.use(protect);

// @route   GET /api/v1/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', userController.getProfile);

// @route   PUT /api/v1/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile',
  validationRules.updateProfile,
  handleValidationErrors,
  userController.updateProfile
);

// @route   GET /api/v1/users/favourites
// @desc    Get user favourites
// @access  Private
router.get('/favourites', userController.getFavourites);

// @route   POST /api/v1/users/favourites/:techId
// @desc    Add technology to favourites
// @access  Private
router.post('/favourites/:techId', userController.addToFavourites);

// @route   DELETE /api/v1/users/favourites/:techId
// @desc    Remove technology from favourites
// @access  Private
router.delete('/favourites/:techId', userController.removeFromFavourites);

// @route   GET /api/v1/users/dashboard
// @desc    Get dashboard data
// @access  Private
router.get('/dashboard', userController.getDashboard);

module.exports = router;