const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  password: { type: String, required: true, select: false }, 
  progress: [{
    technology: { type: mongoose.Schema.Types.ObjectId, ref: 'Technology' },
    steps: [StepProgressSchema],
    percentComplete: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now }
  }],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method for login verification
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Only compile the model IF it hasn't been compiled yet (Prevents Overwrite Error)
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);