const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
  getTechnologies, 
  getTechnologyBySlug, 
  updateProgress // MATCH this with techController exports
} = require('../controllers/techController');

// URL: /api/v1/technologies
router.get('/', getTechnologies);
router.get('/:slug', getTechnologyBySlug);

// URL: /api/v1/technologies/:slug/progress
router.put('/:slug/progress', protect, updateProgress);

module.exports = router;