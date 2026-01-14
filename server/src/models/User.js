const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- 1. Sub-Schema: Individual Step Progress ---
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

// --- 2. Sub-Schema: Overall Technology Progress ---
const ProgressSchema = new mongoose.Schema({
  technology: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Technology', 
    required: true 
  },
  steps: [StepProgressSchema],
  percentComplete: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  lastAccessed: { type: Date, default: Date.now }
});

// --- 3. Main User Schema ---
const UserSchema = new mongoose.Schema({
  // Identity
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, 
  
  // 🔥 NEW: Role Field (Critical for Admin Access)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' // Everyone starts as 'user' by default
  },
  
  // Profile & Customization
  bio: { type: String, default: '' },
  experienceLevel: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Beginner' 
  },
  interests: [{ type: String }],
  
  avatar: {
    type: { type: String, default: 'preset' }, 
    presetOption: { type: String, default: 'avatar1' },
    color: { type: String, default: '#3b82f6' }
  },

  // Gamification Stats
  stats: {
    streak: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    totalHoursSpent: { type: Number, default: 0 },
    totalTechnologies: { type: Number, default: 0 },
    completedTechnologies: { type: Number, default: 0 },
    inProgressTechnologies: { type: Number, default: 0 }
  },

  // Learning Data
  progress: [ProgressSchema],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }]

}, { timestamps: true });

// --- Middleware: Hash Password ---
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Method: Verify Password ---
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);