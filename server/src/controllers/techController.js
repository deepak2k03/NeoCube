const Technology = require('../models/Technology');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

// @desc    Get all technologies with filtering
// @route   GET /api/v1/technologies
// @access  Public
const getTechnologies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      difficulty,
      tags,
      isTrending,
      sort = 'name'
    } = req.query;

    // Build filters
    const filters = {};
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (tags) filters.tags = tags.split(',').map(tag => tag.trim());
    if (isTrending !== undefined) filters.isTrending = isTrending === 'true';

    // Build query
    let query = Technology.search(search, filters);

    // Sorting
    const sortOptions = {
      name: { name: 1 },
      popularity: { popularity: -1 },
      createdAt: { createdAt: -1 },
      difficulty: { difficulty: 1 }
    };
    query = query.sort(sortOptions[sort] || sortOptions.name);

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const technologies = await query
      .skip(skip)
      .limit(limitNum)
      .select('name slug shortDescription category difficulty isTrending tags estimatedTime icon color popularity');

    const total = await Technology.countDocuments(search ? Technology.search(search, filters).getQuery() : {});

    res.status(200).json({
      success: true,
      data: {
        technologies,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
          hasNext: pageNum * limitNum < total,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trending technologies
// @route   GET /api/v1/technologies/trending
// @access  Public
const getTrendingTechnologies = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const technologies = await Technology.findTrending(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        technologies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single technology by slug
// @route   GET /api/v1/technologies/:slug
// @access  Public
const getTechnologyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const technology = await Technology.findOne({ slug })
      .populate({
        path: 'roadmap',
        options: { sort: { order: 1 } }
      });

    if (!technology) {
      return res.status(404).json({
        success: false,
        message: 'Technology not found'
      });
    }

    let userProgress = null;

    // If user is authenticated, get their progress
    if (req.user) {
      const user = await User.findById(req.user._id);
      const progressEntry = user.progress.find(
        p => p.technology.toString() === technology._id.toString()
      );

      if (progressEntry) {
        userProgress = {
          technology: technology._id,
          completedSteps: progressEntry.completedSteps,
          totalSteps: technology.roadmap.length,
          percentage: Math.round((progressEntry.completedSteps.length / technology.roadmap.length) * 100),
          startDate: progressEntry.startDate,
          lastUpdated: progressEntry.lastUpdated,
          completedDate: progressEntry.completedDate
        };
      }
    }

    // Record analytics if user is authenticated
    if (req.user) {
      await Analytics.recordAction(req.user._id, technology._id, 'view', {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
    }

    res.status(200).json({
      success: true,
      data: {
        technology,
        userProgress,
        isFavourite: req.user && req.user.favourites.includes(technology._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get technology categories
// @route   GET /api/v1/technologies/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Technology.distinct('category');

    res.status(200).json({
      success: true,
      data: {
        categories: categories.sort()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all technology tags
// @route   GET /api/v1/technologies/tags
// @access  Public
const getTags = async (req, res) => {
  try {
    const tags = await Technology.distinct('tags');

    res.status(200).json({
      success: true,
      data: {
        tags: tags.sort()
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
  getTechnologies,
  getTrendingTechnologies,
  getTechnologyBySlug,
  getCategories,
  getTags
};