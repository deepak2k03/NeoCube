const express = require('express');
const router = express.Router();
// FIX: IMPORT the model, do NOT use mongoose.model('User', UserSchema) here
const User = require('../models/User'); 
const { protect } = require('../middleware/authMiddleware');

// Example route using the imported User model
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;