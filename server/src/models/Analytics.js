const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  technologyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    required: true
  },
  actionType: {
    type: String,
    enum: ['start', 'complete_step', 'favorite', 'unfavorite', 'view'],
    required: true
  },
  metadata: {
    stepId: mongoose.Schema.Types.ObjectId,
    stepTitle: String,
    timeSpent: Number,
    userAgent: String,
    ipAddress: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Indexes for performance
analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ technologyId: 1, actionType: 1, timestamp: -1 });
analyticsSchema.index({ timestamp: -1 });

// Static method to get user analytics
analyticsSchema.statics.getUserAnalytics = function(userId, limit = 100) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('technologyId', 'name slug icon');
};

// Static method to get technology analytics
analyticsSchema.statics.getTechnologyAnalytics = function(technologyId, limit = 100) {
  return this.find({ technologyId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'name avatar');
};

// Static method to record action
analyticsSchema.statics.recordAction = function(userId, technologyId, actionType, metadata = {}) {
  return this.create({
    userId,
    technologyId,
    actionType,
    metadata: {
      ...metadata,
      userAgent: metadata.userAgent || 'unknown',
      ipAddress: metadata.ipAddress || 'unknown'
    }
  });
};

module.exports = mongoose.model('Analytics', analyticsSchema);