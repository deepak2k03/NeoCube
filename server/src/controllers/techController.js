const Technology = require('../models/Technology');
const User = require('../models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// 1. Get all technologies for the dashboard
exports.getTechnologies = async (req, res) => {
  try {
    const technologies = await Technology.find().select('-roadmap');
    res.status(200).json({ success: true, data: { technologies } }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get tech by slug (Database-First Strategy)
exports.getTechnologyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let tech = await Technology.findOne({ slug });

    if (!tech) return res.status(404).json({ success: false, message: 'Not found' });

    // CACHE CHECK: If roadmap exists in DB, return it immediately
    if (tech.roadmap && tech.roadmap.length > 0) {
      return res.status(200).json({ success: true, data: { technology: tech } });
    }

    // AI GENERATION: Only if DB is empty
    const prompt = `Generate a learning roadmap for ${tech.name}. Return ONLY JSON: {"description": "...", "roadmap": [{"title": "...", "description": "...", "duration": "...", "resources": [{"title": "...", "url": "...", "type": "video/article/documentation/course"}]}]}`;
    const result = await model.generateContent(prompt);
    const aiData = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    tech.roadmap = aiData.roadmap;
    if (aiData.description) tech.description = aiData.description;
    
    await tech.save();
    res.status(200).json({ success: true, data: { technology: tech } });
  } catch (error) {
    res.status(500).json({ success: false, message: "AI generation failed" });
  }
};

// 3. Update Progress and Learning Notes
exports.updateProgress = async (req, res) => {
  try {
    const { slug } = req.params;
    const { stepIndex, status, notes } = req.body;

    const tech = await Technology.findOne({ slug });
    const user = await User.findById(req.user._id);

    // FIX: Check if technology exists before proceeding
    if (!tech) return res.status(404).json({ success: false, message: 'Tech not found' });

    let techProgress = user.progress.find(p => p.technology.toString() === tech._id.toString());
    
    if (!techProgress) {
      techProgress = { technology: tech._id, steps: [] };
      // FIX: Must push to the progress array, not the user object
      user.progress.push(techProgress); 
    }

    const stepIdx = techProgress.steps.findIndex(s => s.stepIndex === stepIndex);
    if (stepIdx >= 0) {
      // Update existing step data
      if (status) techProgress.steps[stepIdx].status = status;
      if (notes !== undefined) techProgress.steps[stepIdx].notes = notes;
    } else {
      // Add new step entry
      techProgress.steps.push({ stepIndex, status: status || 'pending', notes: notes || '' });
    }

    // MANDATORY: Tell Mongoose the nested 'progress' array changed
    user.markModified('progress'); 
    await user.save();

    res.status(200).json({ success: true, data: techProgress });
  } catch (error) {
    console.error("Cloud Sync Error:", error);
    res.status(500).json({ success: false, message: "Cloud sync failed" });
  }
};