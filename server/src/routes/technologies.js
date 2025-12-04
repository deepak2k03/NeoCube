const express = require('express');
const techController = require('../controllers/techController');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Apply optional auth to technology routes (user progress tracking)
router.use(optionalAuth);

// @route   GET /api/v1/technologies
// @desc    Get all technologies with filtering
// @access  Public
router.get('/', techController.getTechnologies);

// @route   GET /api/v1/technologies/trending
// @desc    Get trending technologies
// @access  Public
router.get('/trending', techController.getTrendingTechnologies);

// @route   GET /api/v1/technologies/categories
// @desc    Get technology categories
// @access  Public
router.get('/categories', techController.getCategories);

// @route   GET /api/v1/technologies/tags
// @desc    Get all technology tags
// @access  Public
router.get('/tags', techController.getTags);

// @route   GET /api/v1/technologies/:slug
// @desc    Get single technology by slug
// @access  Public
router.get('/:slug', techController.getTechnologyBySlug);

module.exports = router;