const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateProgress } = require('../controllers/techController'); // Matching name

/**
 * @route   PUT /api/v1/progress/:slug
 */
router.put('/:slug', protect, updateProgress);

module.exports = router;