const express = require('express');
const { validationRules, handleValidationErrors } = require('../utils/validators');
const progressController = require('../controllers/progressController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All progress routes require authentication
router.use(authenticate);

// @route   GET /api/v1/progress/:techId
// @desc    Get user progress for a technology
// @access  Private
router.get('/:techId', progressController.getProgress);

// @route   POST /api/v1/progress/:techId
// @desc    Update progress for a technology
// @access  Private
router.post('/:techId',
  validationRules.updateProgress,
  handleValidationErrors,
  progressController.updateProgress
);

// @route   POST /api/v1/progress/:techId/step/:stepId
// @desc    Mark individual step as complete/incomplete
// @access  Private
router.post('/:techId/step/:stepId', progressController.updateStepProgress);

module.exports = router;