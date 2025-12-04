const { body, validationResult } = require('express-validator');

// Validation rules
const validationRules = {
  // User registration validation
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('interests')
      .optional()
      .isArray()
      .withMessage('Interests must be an array'),
    body('interests.*')
      .optional()
      .isIn(['Web Dev', 'AI/ML', 'DevOps', 'Mobile', 'Data Science', 'Blockchain', 'Cloud', 'UI/UX'])
      .withMessage('Invalid interest value'),
    body('experienceLevel')
      .optional()
      .isIn(['Beginner', 'Intermediate', 'Advanced'])
      .withMessage('Invalid experience level')
  ],

  // User login validation
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // User profile update validation
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('interests')
      .optional()
      .isArray()
      .withMessage('Interests must be an array'),
    body('interests.*')
      .optional()
      .isIn(['Web Dev', 'AI/ML', 'DevOps', 'Mobile', 'Data Science', 'Blockchain', 'Cloud', 'UI/UX'])
      .withMessage('Invalid interest value'),
    body('experienceLevel')
      .optional()
      .isIn(['Beginner', 'Intermediate', 'Advanced'])
      .withMessage('Invalid experience level'),
    body('avatar.type')
      .optional()
      .isIn(['preset', 'uploaded'])
      .withMessage('Avatar type must be preset or uploaded'),
    body('avatar.presetOption')
      .optional()
      .isIn(['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'])
      .withMessage('Invalid preset avatar option'),
    body('avatar.color')
      .optional()
      .isHexColor()
      .withMessage('Avatar color must be a valid hex color')
  ],

  // Technology validation
  createTechnology: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('shortDescription')
      .trim()
      .isLength({ max: 200 })
      .withMessage('Short description cannot exceed 200 characters'),
    body('longDescription')
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Long description cannot exceed 2000 characters'),
    body('category')
      .isIn(['Web Development', 'Frontend', 'Backend', 'DevOps', 'AI/ML', 'Mobile', 'Database', 'Cloud', 'Blockchain', 'UI/UX'])
      .withMessage('Invalid category'),
    body('difficulty')
      .isIn(['Beginner', 'Intermediate', 'Advanced'])
      .withMessage('Invalid difficulty level'),
    body('estimatedTime')
      .trim()
      .notEmpty()
      .withMessage('Estimated time is required'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('prerequisites')
      .optional()
      .isArray()
      .withMessage('Prerequisites must be an array')
  ],

  // Progress update validation
  updateProgress: [
    body('completedSteps')
      .isArray()
      .withMessage('Completed steps must be an array'),
    body('completedSteps.*')
      .isMongoId()
      .withMessage('Each completed step must be a valid ID'),
    body('hoursSpent')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Hours spent must be a positive number')
  ]
};

// Function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }

  next();
};

module.exports = {
  validationRules,
  handleValidationErrors,
};