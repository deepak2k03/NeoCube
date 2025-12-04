const mongoose = require('mongoose');

const roadmapStepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Step title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Step description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  resources: [{
    type: {
      type: String,
      enum: ['video', 'article', 'course', 'docs', 'project'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    },
    duration: String,
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard']
    }
  }],
  order: {
    type: Number,
    required: true
  },
  estimatedHours: {
    type: Number,
    default: 0
  }
}, { _id: true });

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Technology name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  longDescription: {
    type: String,
    required: [true, 'Long description is required'],
    maxlength: [2000, 'Long description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Web Development', 'Frontend', 'Backend', 'DevOps', 'AI/ML', 'Mobile', 'Database', 'Cloud', 'Blockchain', 'UI/UX']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  estimatedTime: {
    type: String,
    required: [true, 'Estimated time is required']
  },
  prerequisites: [{
    type: String,
    trim: true,
    maxlength: [100, 'Prerequisite cannot exceed 100 characters']
  }],
  icon: {
    type: String,
    default: '💻'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  roadmap: [roadmapStepSchema],
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for total steps
technologySchema.virtual('totalSteps').get(function() {
  return this.roadmap.length;
});

// Virtual for total estimated hours
technologySchema.virtual('totalEstimatedHours').get(function() {
  return this.roadmap.reduce((total, step) => total + (step.estimatedHours || 0), 0);
});

// Pre-save middleware to generate slug
technologySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Method to get user progress for this technology
technologySchema.methods.getUserProgress = function(userId) {
  // This would typically be populated from the User model
  return {
    technology: this._id,
    completedSteps: [],
    totalSteps: this.totalSteps,
    percentage: 0,
    startDate: null,
    lastUpdated: null,
    completedDate: null
  };
};

// Static method to find trending technologies
technologySchema.statics.findTrending = function(limit = 6) {
  return this.find({ isTrending: true })
    .sort({ popularity: -1 })
    .limit(limit)
    .select('name slug shortDescription category difficulty isTrending tags estimatedTime icon color popularity');
};

// Static method to search technologies
technologySchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    $and: []
  };

  // Text search
  if (query) {
    searchQuery.$and.push({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { shortDescription: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    });
  }

  // Category filter
  if (filters.category) {
    searchQuery.$and.push({ category: filters.category });
  }

  // Difficulty filter
  if (filters.difficulty) {
    searchQuery.$and.push({ difficulty: filters.difficulty });
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    searchQuery.$and.push({ tags: { $in: filters.tags } });
  }

  // Trending filter
  if (filters.isTrending !== undefined) {
    searchQuery.$and.push({ isTrending: filters.isTrending });
  }

  // If no filters, return all
  if (searchQuery.$and.length === 0) {
    return this.find({});
  }

  return this.find(searchQuery);
};

module.exports = mongoose.model('Technology', technologySchema);