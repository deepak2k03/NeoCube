const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  avatar: {
    type: {
      type: String,
      enum: ['preset', 'uploaded'],
      default: 'preset'
    },
    url: String,
    presetOption: {
      type: String,
      enum: ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'],
      default: 'avatar1'
    },
    color: {
      type: String,
      default: '#6366f1'
    }
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    trim: true
  },
  interests: [{
    type: String,
    enum: ['Web Dev', 'AI/ML', 'DevOps', 'Mobile', 'Data Science', 'Blockchain', 'Cloud', 'UI/UX']
  }],
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  }],
  progress: [{
    technology: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technology'
    },
    completedSteps: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    completedDate: Date
  }],
  streak: {
    type: Number,
    default: 0
  },
  totalHoursSpent: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user stats
userSchema.methods.getStats = function() {
  const totalTech = this.progress.length;
  const completedTech = this.progress.filter(p =>
    p.completedDate && p.completedSteps.length > 0
  ).length;
  const inProgressTech = totalTech - completedTech;

  return {
    totalTechnologies: totalTech,
    completedTechnologies: completedTech,
    inProgressTechnologies: inProgressTech,
    totalHoursSpent: this.totalHoursSpent,
    streak: this.streak,
    level: this.level,
    favourites: this.favourites.length
  };
};

// Virtual for user's full profile info
userSchema.virtual('profile').get(function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    bio: this.bio,
    interests: this.interests,
    experienceLevel: this.experienceLevel,
    stats: this.getStats(),
    createdAt: this.createdAt
  };
});

module.exports = mongoose.model('User', userSchema);