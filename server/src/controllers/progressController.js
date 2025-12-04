const User = require('../models/User');
const Technology = require('../models/Technology');
const Analytics = require('../models/Analytics');

// @desc    Get user progress for a technology
// @route   GET /api/v1/progress/:techId
// @access  Private
const getProgress = async (req, res) => {
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
    const progressEntry = user.progress.find(
      p => p.technology.toString() === techId
    );

    if (!progressEntry) {
      return res.status(200).json({
        success: true,
        data: {
          progress: {
            technology: techId,
            completedSteps: [],
            totalSteps: technology.roadmap.length,
            percentage: 0,
            startDate: null,
            lastUpdated: null,
            completedDate: null,
            estimatedHoursSpent: 0
          }
        }
      });
    }

    const progress = {
      technology: techId,
      completedSteps: progressEntry.completedSteps,
      totalSteps: technology.roadmap.length,
      percentage: Math.round((progressEntry.completedSteps.length / technology.roadmap.length) * 100),
      startDate: progressEntry.startDate,
      lastUpdated: progressEntry.lastUpdated,
      completedDate: progressEntry.completedDate,
      estimatedHoursSpent: progressEntry.hoursSpent || 0
    };

    res.status(200).json({
      success: true,
      data: { progress }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update progress for a technology
// @route   POST /api/v1/progress/:techId
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { techId } = req.params;
    const { completedSteps, hoursSpent } = req.body;

    // Check if technology exists
    const technology = await Technology.findById(techId);
    if (!technology) {
      return res.status(404).json({
        success: false,
        message: 'Technology not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Find existing progress entry or create new one
    let progressEntry = user.progress.find(
      p => p.technology.toString() === techId
    );

    if (!progressEntry) {
      // Create new progress entry
      progressEntry = {
        technology: techId,
        completedSteps: completedSteps || [],
        startDate: new Date(),
        lastUpdated: new Date()
      };
      user.progress.push(progressEntry);
    } else {
      // Update existing progress entry
      progressEntry.completedSteps = completedSteps || [];
      progressEntry.lastUpdated = new Date();
    }

    // Add hours spent if provided
    if (hoursSpent) {
      progressEntry.hoursSpent = (progressEntry.hoursSpent || 0) + hoursSpent;
      user.totalHoursSpent += hoursSpent;
    }

    // Check if all steps are completed
    if (progressEntry.completedSteps.length === technology.roadmap.length && !progressEntry.completedDate) {
      progressEntry.completedDate = new Date();

      // Record analytics for completion
      await Analytics.recordAction(user._id, techId, 'complete_step', {
        stepId: 'completion',
        stepTitle: 'Technology completed',
        timeSpent: hoursSpent || 0
      });
    }

    // Record analytics for each completed step
    for (const stepId of completedSteps) {
      const step = technology.roadmap.id(stepId);
      if (step) {
        await Analytics.recordAction(user._id, techId, 'complete_step', {
          stepId: stepId,
          stepTitle: step.title,
          timeSpent: hoursSpent ? hoursSpent / completedSteps.length : 0
        });
      }
    }

    // Update user level based on completed technologies
    const completedTechnologies = user.progress.filter(p => p.completedDate).length;
    user.level = Math.floor(completedTechnologies / 3) + 1; // Level up every 3 completed technologies

    await user.save();

    const progress = {
      technology: techId,
      completedSteps: progressEntry.completedSteps,
      totalSteps: technology.roadmap.length,
      percentage: Math.round((progressEntry.completedSteps.length / technology.roadmap.length) * 100),
      startDate: progressEntry.startDate,
      lastUpdated: progressEntry.lastUpdated,
      completedDate: progressEntry.completedDate,
      estimatedHoursSpent: progressEntry.hoursSpent || 0
    };

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: { progress }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark individual step as complete/incomplete
// @route   POST /api/v1/progress/:techId/step/:stepId
// @access  Private
const updateStepProgress = async (req, res) => {
  try {
    const { techId, stepId } = req.params;
    const { completed, hoursSpent } = req.body;

    // Check if technology exists
    const technology = await Technology.findById(techId);
    if (!technology) {
      return res.status(404).json({
        success: false,
        message: 'Technology not found'
      });
    }

    // Check if step exists
    const step = technology.roadmap.id(stepId);
    if (!step) {
      return res.status(404).json({
        success: false,
        message: 'Step not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Find or create progress entry
    let progressEntry = user.progress.find(
      p => p.technology.toString() === techId
    );

    if (!progressEntry) {
      progressEntry = {
        technology: techId,
        completedSteps: [],
        startDate: new Date(),
        lastUpdated: new Date()
      };
      user.progress.push(progressEntry);
    }

    // Update step completion status
    const stepIndex = progressEntry.completedSteps.indexOf(stepId);
    if (completed && stepIndex === -1) {
      progressEntry.completedSteps.push(stepId);
    } else if (!completed && stepIndex > -1) {
      progressEntry.completedSteps.splice(stepIndex, 1);
    }

    progressEntry.lastUpdated = new Date();

    // Add hours spent if provided
    if (hoursSpent) {
      progressEntry.hoursSpent = (progressEntry.hoursSpent || 0) + hoursSpent;
      user.totalHoursSpent += hoursSpent;
    }

    // Check if all steps are completed
    if (progressEntry.completedSteps.length === technology.roadmap.length && !progressEntry.completedDate) {
      progressEntry.completedDate = new Date();
    } else if (progressEntry.completedSteps.length < technology.roadmap.length && progressEntry.completedDate) {
      progressEntry.completedDate = undefined;
    }

    // Record analytics
    await Analytics.recordAction(user._id, techId, 'complete_step', {
      stepId: stepId,
      stepTitle: step.title,
      timeSpent: hoursSpent || 0
    });

    // Update user level
    const completedTechnologies = user.progress.filter(p => p.completedDate).length;
    user.level = Math.floor(completedTechnologies / 3) + 1;

    await user.save();

    const progress = {
      technology: techId,
      completedSteps: progressEntry.completedSteps,
      totalSteps: technology.roadmap.length,
      percentage: Math.round((progressEntry.completedSteps.length / technology.roadmap.length) * 100),
      startDate: progressEntry.startDate,
      lastUpdated: progressEntry.lastUpdated,
      completedDate: progressEntry.completedDate,
      estimatedHoursSpent: progressEntry.hoursSpent || 0
    };

    res.status(200).json({
      success: true,
      message: `Step ${completed ? 'completed' : 'uncompleted'} successfully`,
      data: { progress }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProgress,
  updateProgress,
  updateStepProgress
};