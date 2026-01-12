const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 1. FORCE LOAD .ENV (Fixes "MISSING" error)
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug Check
console.log("Checking Mongo URI:", "mongodb+srv://deepak2k03:Deepak2003@cluster0.h80fnzq.mongodb.net/NeoCube?appName=Cluster0" ? "Found" : "MISSING (Check .env file!)");

// 2. IMPORT MODEL (Fixes path based on your screenshots)
const Technology = require('./src/models/Technology'); 

// --- THE DATA PAYLOAD ---
const technologies = [
  // 1. COMPUTER SCIENCE (CS)
  { name: 'React.js', category: 'Frontend', difficulty: 'Intermediate', fieldId: 'cs', isTrending: true, estimatedTime: '3 Months' },
  { name: 'Node.js', category: 'Backend', difficulty: 'Intermediate', fieldId: 'cs', isTrending: true, estimatedTime: '3 Months' },
  { name: 'Docker', category: 'DevOps', difficulty: 'Intermediate', fieldId: 'cs', isTrending: false, estimatedTime: '2 Months' },
  { name: 'Python', category: 'AI/ML', difficulty: 'Beginner', fieldId: 'cs', isTrending: true, estimatedTime: '4 Months' },
  
  // 2. HEALTHCARE (MedTech)
  { name: 'Da Vinci Systems', category: 'Robotics', difficulty: 'Advanced', fieldId: 'medtech', isTrending: true, estimatedTime: '6 Months' },
  { name: 'DICOM Standards', category: 'Patient Data', difficulty: 'Intermediate', fieldId: 'medtech', isTrending: false, estimatedTime: '2 Months' },
  { name: 'Telehealth APIs', category: 'Telemedicine', difficulty: 'Beginner', fieldId: 'medtech', isTrending: true, estimatedTime: '1 Month' },
  { name: 'AI Radiology', category: 'Diagnostics', difficulty: 'Advanced', fieldId: 'medtech', isTrending: true, estimatedTime: '8 Months' },

  // 3. AGRICULTURE (AgriTech)
  { name: 'IoT Soil Sensors', category: 'Precision Farming', difficulty: 'Beginner', fieldId: 'agritech', isTrending: true, estimatedTime: '2 Months' },
  { name: 'John Deere Ops Center', category: 'Supply Chain', difficulty: 'Intermediate', fieldId: 'agritech', isTrending: false, estimatedTime: '3 Months' },
  { name: 'Agri-Drones', category: 'Robotics', difficulty: 'Advanced', fieldId: 'agritech', isTrending: true, estimatedTime: '4 Months' },
  
  // 4. FINANCE (FinTech)
  { name: 'Solidity', category: 'Blockchain', difficulty: 'Advanced', fieldId: 'fintech', isTrending: true, estimatedTime: '5 Months' },
  { name: 'Stripe API', category: 'Payments', difficulty: 'Beginner', fieldId: 'fintech', isTrending: false, estimatedTime: '1 Month' },
  { name: 'Algorithmic Trading', category: 'Trading', difficulty: 'Advanced', fieldId: 'fintech', isTrending: true, estimatedTime: '6 Months' },

  // 5. DEFENSE
  { name: 'Cyber Warfare Ops', category: 'Cyber', difficulty: 'Advanced', fieldId: 'defense', isTrending: true, estimatedTime: '12 Months' },
  { name: 'Drone Swarm Control', category: 'Hardware', difficulty: 'Advanced', fieldId: 'defense', isTrending: true, estimatedTime: '8 Months' },
];

// Helper to assign Icons
const getIconForCategory = (cat) => {
  const map = {
    'Frontend': 'Code2', 'Backend': 'Globe', 'DevOps': 'Server',
    'Robotics': 'Cpu', 'AI/ML': 'Zap', 'Blockchain': 'Link'
  };
  return map[cat] || 'Layers';
};

// --- THE LAUNCH SEQUENCE ---
const seedDB = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB...');

    // 1. Clear existing data
    await Technology.deleteMany({});
    console.log('🗑️  Purged old records...');

    // 2. Format Data (This fixes the Validation Error)
    const formattedTechs = technologies.map(tech => ({
      ...tech,
      slug: tech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      shortDescription: `Learn ${tech.name} for the ${tech.fieldId.toUpperCase()} industry.`,
      
      // FIX: Add a real string here so Mongoose validation passes
      longDescription: `This is a placeholder description for ${tech.name}. The AI curriculum generator will replace this with a detailed overview upon the first user request.`,
      
      roadmap: [], 
      icon: getIconForCategory(tech.category) 
    }));

    // 3. Insert Data
    await Technology.insertMany(formattedTechs);
    console.log(`🚀 Successfully injected ${formattedTechs.length} technologies!`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();