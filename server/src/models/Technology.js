const mongoose = require('mongoose');

// --- 1. Resource Schema (Fixed) ---
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: false },
  url: { type: String, required: false },
  type: {
    type: String,
    // 🔥 FIX: Removed 'enum' restriction. 
    // Gemini generates creative types like 'video-series', 'showcase', etc.
    // We now accept ANY string to prevent validation crashes.
    default: 'article'
  }
});

// --- 2. Roadmap Step Schema ---
const roadmapStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: false }, // Made optional to be safe
  resources: [resourceSchema]
});

// --- 3. Technology Schema ---
const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  description: { type: String, required: true },
  category: { type: String, required: true }, 
  
  // Sector Mapping (e.g., 'cs', 'marketing')
  sector: { 
    type: String, 
    required: true, 
    default: 'cs', 
    index: true 
  },

  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  
  roadmap: [roadmapStepSchema],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Technology', technologySchema);