const User = require('../models/User');
const Technology = require('../models/Technology');
const Analytics = require('../models/Analytics');

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favourites', 'name slug shortDescription category difficulty icon color isTrending')
      .populate('progress.technology', 'name slug shortDescription icon color');

    res.status(200).json({
      success: true,
      data: {
        user: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio, interests, experienceLevel, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (interests) user.interests = interests;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (avatar) {
      user.avatar = { ...user.avatar, ...avatar };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user favourites
// @route   GET /api/v1/users/favourites
// @access  Private
const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favourites',
        select: 'name slug shortDescription category difficulty isTrending tags estimatedTime icon color popularity',
        populate: {
          path: 'progress.technology',
          select: 'completedSteps lastUpdated'
        }
      });

    res.status(200).json({
      success: true,
      data: {
        technologies: user.favourites,
        total: user.favourites.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add technology to favourites
// @route   POST /api/v1/users/favourites/:techId
// @access  Private
const addToFavourites = async (req, res) => {
  try {
    const { techId } = req.params;

    // Check if technology exists
    const technology = await Technology.findById(techId);
    if (!technology) {
      return res.status(404).json({
        success: false,
        message: 'Technology not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Check if already in favourites
    if (user.favourites.includes(techId)) {
      return res.status(409).json({
        success: false,
        message: 'Technology already in favourites'
      });
    }

    // Add to favourites
    user.favourites.push(techId);
    await user.save();

    // Increment technology popularity
    await Technology.findByIdAndUpdate(techId, {
      $inc: { popularity: 1 }
    });

    // Record analytics
    await Analytics.recordAction(user._id, techId, 'favorite');

    res.status(200).json({
      success: true,
      message: 'Added to favourites successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove technology from favourites
// @route   DELETE /api/v1/users/favourites/:techId
// @access  Private
const removeFromFavourites = async (req, res) => {
  try {
    const { techId } = req.params;

    const user = await User.findById(req.user._id);

    // Check if technology is in favourites
    if (!user.favourites.includes(techId)) {
      return res.status(404).json({
        success: false,
        message: 'Technology not in favourites'
      });
    }

    // Remove from favourites
    user.favourites = user.favourites.filter(fav => fav.toString() !== techId);
    await user.save();

    // Decrement technology popularity
    await Technology.findByIdAndUpdate(techId, {
      $inc: { popularity: -1 }
    });

    // Record analytics
    await Analytics.recordAction(user._id, techId, 'unfavorite');

    res.status(200).json({
      success: true,
      message: 'Removed from favourites successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard data
// @route   GET /api/v1/users/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'progress.technology',
        select: 'name slug shortDescription category difficulty icon color isTrending',
        populate: {
          path: 'roadmap',
          select: 'title order'
        }
      })
      .populate('favourites', 'name slug shortDescription category difficulty icon color isTrending');

    // Get in-progress technologies
    const inProgressTechnologies = user.progress
      .filter(p => !p.completedDate)
      .map(p => ({
        ...p.technology.toObject(),
        progress: {
          completedSteps: p.completedSteps.length,
          totalSteps: p.technology.roadmap.length,
          percentage: Math.round((p.completedSteps.length / p.technology.roadmap.length) * 100),
          lastUpdated: p.lastUpdated,
          startDate: p.startDate
        }
      }));

    // Get recommendations based on user interests and experience level
    const recommendations = await Technology.find({
      _id: { $nin: user.favourites },
      category: { $in: user.interests.length > 0 ? user.interests : ['Web Development'] },
      difficulty: user.experienceLevel
    })
    .limit(6)
    .select('name slug shortDescription category difficulty icon color isTrending tags');

    // Get stats
    const stats = user.getStats();
    stats.inProgress = inProgressTechnologies.length;
    stats.favourites = user.favourites.length;

    // Calculate weekly hours (mock data for now)
    stats.weeklyHours = Math.floor(Math.random() * 20) + 5;

    res.status(200).json({
      success: true,
      data: {
        stats,
        inProgressTechnologies,
        favourites: user.favourites,
        recommendations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getFavourites,
  addToFavourites,
  removeFromFavourites,
  getDashboard
};