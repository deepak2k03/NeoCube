const path = require('path');
// 🔥 FORCE LOAD .ENV from parent folder if needed
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 
require('dotenv').config(); 

const Technology = require('../models/Technology');
const User = require('../models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. DEBUG & VALIDATION ---
const rawKey = process.env.GEMINI_API_KEY;

if (!rawKey) {
  console.error("\n❌ FATAL ERROR: GEMINI_API_KEY is missing from process.env!");
  console.error("   Check your .env file in the server root.");
} else {
  console.log(`\n✅ AI Controller Loaded Key: ...${rawKey.trim().slice(-4)}`);
}

// --- 2. INITIALIZE AI ---
const genAI = new GoogleGenerativeAI(rawKey ? rawKey.trim() : "MISSING_KEY");

// ✅ FIX: Use 'gemini-flash-latest' which is the stable alias for your key
const MODEL_NAME = "gemini-flash-latest"; 
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

console.log(`✅ AI Model Initialized: ${MODEL_NAME}\n`);

// --- 3. ROBUST JSON EXTRACTOR (Fixes "Invalid JSON" errors) ---
const extractJSON = (text) => {
  try {
    console.log(`[DEBUG] Raw AI Output Length: ${text.length}`);
    
    // 1. Remove Markdown code blocks first
    let clean = text.replace(/```json/g, '').replace(/```/g, '');

    // 2. Try parsing the clean text directly
    try {
        return JSON.parse(clean);
    } catch (e) {
        // If that fails, it has extra text. Let's hunt for the JSON structure.
    }

    // 3. Regex Hunt: Find the first '[' and last ']' (for Arrays)
    const arrayMatch = clean.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
        try {
            return JSON.parse(arrayMatch[0]);
        } catch (e) { /* Continue to object check */ }
    }

    // 4. Regex Hunt: Find the first '{' and last '}' (for Objects)
    const objectMatch = clean.match(/\{[\s\S]*\}/);
    if (objectMatch) {
        return JSON.parse(objectMatch[0]);
    }

    throw new Error("No JSON structure found in response");

  } catch (e) {
    console.error("JSON PARSE ERROR. Raw text snippet:", text.slice(0, 100) + "...");
    throw new Error("AI returned invalid JSON.");
  }
};

// --- HELPER: Generate Content ---
const generatePremiumRoadmap = async (name, fieldId) => {
  console.log(`[GEN] Sending request to Gemini (${MODEL_NAME}) for: ${name}...`);

  // 1. Metadata Prompt (Strict JSON)
  const metaPrompt = `
    Act as a Curriculum Architect. Provide metadata for a course on "${name}" (Sector: ${fieldId}).
    CRITICAL: Return ONLY raw JSON. Do NOT use Markdown. Do NOT say "Here is the JSON".
    {
      "description": "2 sentence professional summary",
      "category": "Development",
      "difficulty": "Intermediate"
    }
  `;
  
  try {
    const metaResult = await model.generateContent(metaPrompt);
    const meta = extractJSON(metaResult.response.text());

    // 2. Roadmap Prompt (Strict JSON Array)
    const roadmapPrompt = `
      Create a detailed learning roadmap for ${name}.
      CRITICAL: Return ONLY a raw JSON ARRAY. Do NOT use Markdown. Do NOT explain.
      [
        {
          "title": "Step Title",
          "description": "Deep technical explanation (3-4 sentences)",
          "duration": "e.g. 2 hours",
          "resources": [
             { "title": "Official Docs", "url": "https://google.com/search?q=${name}", "type": "article" },
             { "title": "Senior Tip", "url": "Tip text here", "type": "pro-tip" },
             { "title": "Lethal Quest", "url": "Challenge text here", "type": "quest" },
             { "title": "Interview Prep", "url": "Question text here", "type": "interview" }
          ]
        }
      ]
      Generate 10 steps.
    `;

    const roadmapResult = await model.generateContent(roadmapPrompt);
    const roadmap = extractJSON(roadmapResult.response.text());

    return { meta, roadmap };
  } catch (err) {
    console.error(`\n❌ GEMINI API ERROR:`);
    console.error(`   Message: ${err.message}`);
    throw err;
  }
};

// 1. Get List
exports.getTechnologies = async (req, res) => {
  try {
    const { fieldId, category, search } = req.query;
    let query = {};
    if (fieldId && fieldId !== 'all') {
      if (fieldId === 'cs') query.$or = [{ sector: 'cs' }, { sector: null }];
      else query.sector = fieldId;
    }
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const technologies = await Technology.find(query).select('-roadmap');
    res.status(200).json({ success: true, data: { technologies } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Detail (Auto-Generate)
exports.getTechnologyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let tech = await Technology.findOne({ slug });

    if (!tech) return res.status(404).json({ success: false, message: 'Not found' });

    // 🔥 AUTO-FIX
    if (!tech.roadmap || tech.roadmap.length === 0) {
      console.log(`[AUTO-FIX] Empty roadmap detected for ${tech.name}. Regenerating...`);
      try {
        const { meta, roadmap } = await generatePremiumRoadmap(tech.name, tech.sector || 'cs');
        tech.roadmap = roadmap;
        tech.description = meta.description;
        tech.category = meta.category;
        tech.difficulty = meta.difficulty;
        await tech.save();
        console.log(`[AUTO-FIX] Success! Saved ${tech.roadmap.length} steps.`);
      } catch (genError) {
        console.error("[AUTO-FIX] Failed to generate:", genError.message);
      }
    }

    res.status(200).json({ success: true, data: { technology: tech } });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. Create Technology
exports.createTechnology = async (req, res) => {
  try {
    const { name, fieldId } = req.body;
    if (!name || !fieldId) return res.status(400).json({ success: false, message: "Missing fields" });

    const existing = await Technology.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) return res.status(400).json({ success: false, message: "Technology already exists." });

    // Use our helper to get data
    const { meta, roadmap } = await generatePremiumRoadmap(name, fieldId);
    
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const newTech = new Technology({
      name, slug, sector: fieldId,
      description: meta.description,
      category: meta.category,
      difficulty: meta.difficulty,
      roadmap: roadmap
    });

    await newTech.save();
    console.log(`[DB] Created ${name} successfully.`);
    res.status(201).json({ success: true, data: newTech });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Progress
exports.updateProgress = async (req, res) => {
  try {
    const { slug } = req.params;
    const { stepIndex, status } = req.body;
    const tech = await Technology.findOne({ slug });
    if (!tech) return res.status(404).json({ success: false });

    const user = await User.findById(req.user._id);
    let prog = user.progress.find(p => p.technology.toString() === tech._id.toString());
    
    if (!prog) {
      prog = { technology: tech._id, steps: [] };
      user.progress.push(prog); 
    }
    const stepIdx = prog.steps.findIndex(s => s.stepIndex === stepIndex);
    if (stepIdx >= 0) prog.steps[stepIdx].status = status;
    else prog.steps.push({ stepIndex, status: status || 'pending' });

    await user.save();
    res.status(200).json({ success: true, data: prog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sync failed" });
  }
};