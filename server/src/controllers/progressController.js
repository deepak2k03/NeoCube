const Technology = require('../models/Technology');
const User = require('../models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Fallback to flash if flash-lite is unavailable/busy
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

// 1. Get all technologies (Legacy-Safe Filter)
exports.getTechnologies = async (req, res) => {
  try {
    const { fieldId, category, search } = req.query;
    let query = {};

    if (fieldId && fieldId !== 'all') {
      if (fieldId === 'cs') {
        query.$or = [{ sector: 'cs' }, { sector: { $exists: false } }, { sector: null }];
      } else {
        query.sector = fieldId;
      }
    }

    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const technologies = await Technology.find(query).select('-roadmap');
    res.status(200).json({ success: true, data: { technologies } }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get tech by slug (BULLETPROOF VERSION)
exports.getTechnologyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let tech = await Technology.findOne({ slug });

    if (!tech) return res.status(404).json({ success: false, message: 'Technology not found in DB' });

    // IF Roadmap exists, return immediately
    if (tech.roadmap && tech.roadmap.length > 0) {
      return res.status(200).json({ success: true, data: { technology: tech } });
    }

    // AI GENERATION SAFETY BLOCK
    try {
      console.log(`🤖 Attempting to generate roadmap for: ${tech.name}...`);
      const prompt = `Generate a learning roadmap for ${tech.name}. Return ONLY JSON: {"description": "...", "roadmap": [{"title": "...", "description": "...", "duration": "...", "resources": [{"title": "...", "url": "...", "type": "video/article/documentation/course"}]}]}`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, "").trim(); // Clean cleanup
      const aiData = JSON.parse(text);

      tech.roadmap = aiData.roadmap;
      if (aiData.description) tech.description = aiData.description;
      await tech.save();
      console.log("✅ Roadmap generated and saved!");

    } catch (aiError) {
      // IF AI FAILS: Log it, but DO NOT CRASH. Return the tech anyway.
      console.error("⚠️ AI Generation Failed:", aiError.message);
      console.error("Returning technology without roadmap to prevent crash.");
      // We return the tech with an empty roadmap so the page still loads
    }

    res.status(200).json({ success: true, data: { technology: tech } });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// 3. Update Progress (Standard)
exports.updateProgress = async (req, res) => {
  try {
    const { slug } = req.params;
    const { stepIndex, status, notes } = req.body;

    const tech = await Technology.findOne({ slug });
    if (!tech) return res.status(404).json({ success: false, message: 'Tech not found' });

    const user = await User.findById(req.user._id);
    let techProgress = user.progress.find(p => p.technology.toString() === tech._id.toString());
    
    if (!techProgress) {
      techProgress = { technology: tech._id, steps: [] };
      user.progress.push(techProgress); 
    }

    const stepIdx = techProgress.steps.findIndex(s => s.stepIndex === stepIndex);
    if (stepIdx >= 0) {
      if (status) techProgress.steps[stepIdx].status = status;
      if (notes !== undefined) techProgress.steps[stepIdx].notes = notes;
    } else {
      techProgress.steps.push({ stepIndex, status: status || 'pending', notes: notes || '' });
    }

    user.markModified('progress'); 
    await user.save();
    res.status(200).json({ success: true, data: techProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cloud sync failed" });
  }
};