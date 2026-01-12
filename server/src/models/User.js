const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For secure login logic

const StepProgressSchema = new mongoose.Schema({
  stepIndex: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending' 
  },
  notes: { type: String, default: '' },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // 'select: false' protects the hash from leaks
  
  progress: [{
    technology: { type: mongoose.Schema.Types.ObjectId, ref: 'Technology' },
    steps: [StepProgressSchema],
    percentComplete: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now }
  }],

  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }]
}, { timestamps: true });

// --- WORLD CLASS ADDS: AUTH LOGIC ---

// 1. Encrypt password before saving (Fixes signup issues)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. Match user entered password to hashed password in database (Fixes Login 500 error)
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);