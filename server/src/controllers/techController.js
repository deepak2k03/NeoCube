const Technology = require('../models/Technology');
const User = require('../models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// 1. Get all technologies
exports.getTechnologies = async (req, res) => {
  try {
    const { fieldId, category, search } = req.query;
    let query = {};

    // Sector Filter Logic
    if (fieldId && fieldId !== 'all') {
      if (fieldId === 'cs') {
        query.$or = [
          { sector: 'cs' },
          { sector: { $exists: false } },
          { sector: null }
        ];
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

// 2. Get tech by slug
exports.getTechnologyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let tech = await Technology.findOne({ slug });

    if (!tech) return res.status(404).json({ success: false, message: 'Not found' });

    res.status(200).json({ success: true, data: { technology: tech } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. Create New Technology (The Missing Piece)
exports.createTechnology = async (req, res) => {
  try {
    const { name, fieldId } = req.body; // Frontend sends 'fieldId'

    // Validation
    if (!name || !fieldId) {
      return res.status(400).json({ success: false, message: "Name and Field ID are required." });
    }

    // Check Duplicate
    const existing = await Technology.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Technology already exists." });
    }

    console.log(`[Gemini] Generating roadmap for: ${name} in sector ${fieldId}...`);

    // Prompt Gemini
    const prompt = `
      You are an expert curriculum designer. Create a learning roadmap for the technology "${name}" which belongs to the sector "${fieldId}".
      
      Return ONLY valid JSON. No markdown. Structure:
      {
        "description": "Short professional description (max 2 sentences).",
        "category": "Development", 
        "difficulty": "Beginner",
        "roadmap": [
          {
            "title": "Phase 1: Fundamentals",
            "description": "Core concepts to learn first.",
            "duration": "2 weeks",
            "resources": [
              {"title": "Intro to ${name}", "url": "https://google.com/search?q=${name}+tutorial", "type": "article"}
            ]
          },
          {
            "title": "Phase 2: Core Skills",
            "description": "Building deeper knowledge.",
            "duration": "3 weeks",
            "resources": []
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json|```/g, "").trim();
    
    let aiData;
    try {
      aiData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Gemini JSON Error:", responseText);
      return res.status(500).json({ success: false, message: "AI Generation failed to produce valid JSON." });
    }

    // Generate Slug
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // Create & Save
    const newTech = new Technology({
      name,
      slug,
      sector: fieldId, // Map fieldId to sector
      description: aiData.description || `Learn ${name} from scratch.`,
      category: aiData.category || 'General',
      difficulty: aiData.difficulty || 'Beginner',
      roadmap: aiData.roadmap || [],
      createdAt: new Date()
    });

    await newTech.save();
    console.log(`[Success] Created ${name}`);

    res.status(201).json({ success: true, data: newTech });

  } catch (error) {
    console.error("Create Tech Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Progress
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