const express = require('express');
const router = express.Router();
// Import both middlewares
const { protect, authorize } = require('../middleware/authMiddleware');

const { 
  getTechnologies, 
  getTechnologyBySlug, 
  createTechnology, 
  updateProgress 
} = require('../controllers/techController');

// URL: /api/v1/technologies

// Public Routes (Anyone can view)
router.get('/', getTechnologies);
router.get('/:slug', getTechnologyBySlug);

// User Protected Routes (Must be logged in to track progress)
router.put('/:slug/progress', protect, updateProgress);

// 🔥 ADMIN ONLY ROUTE
// 1. protect: Must be logged in
// 2. authorize('admin'): Must have role="admin"
router.post('/', protect, authorize('admin'), createTechnology);

module.exports = router;