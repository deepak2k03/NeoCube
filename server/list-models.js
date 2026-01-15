// Run this with: node list_models.js
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ No API Key found in .env");
  process.exit(1);
}

console.log(`🔍 Checking available models for key ending in ...${API_KEY.slice(-4)}`);

async function getModels() {
  try {
    // Direct REST API call to Google
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();

    if (data.error) {
      console.error("\n❌ API Error:", data.error.message);
      return;
    }

    if (!data.models) {
      console.error("\n❌ No models returned. Is the 'Generative Language API' enabled in Google Cloud Console?");
      return;
    }

    console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
    console.log("---------------------------------");
    
    // Filter for "generateContent" capable models
    const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    chatModels.forEach(model => {
      // Clean up the name (remove "models/" prefix)
      const cleanName = model.name.replace('models/', '');
      console.log(`• ${cleanName}`);
    });
    
    console.log("---------------------------------");
    console.log("👉 Pick one of the above and use it in your techcontroller.js");

  } catch (err) {
    console.error("❌ Network Request Failed:", err.message);
  }
}

getModels();