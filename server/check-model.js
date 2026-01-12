require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listSupportedModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // We use the root client to fetch the list of all models
    // Note: In newer SDKs, this is genAI.listModels()
    console.log("Checking your supported models...");
    
    // Fallback test for the 2026 standard models
    const testModels = [
      "gemini-2.5-flash", 
      "gemini-2.5-flash-lite", 
      "gemini-2.0-flash", 
      "gemini-1.5-flash-latest"
    ];

    for (const name of testModels) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        await model.generateContent("test");
        console.log(`✅ SUPPORTED: ${name}`);
      } catch (err) {
        console.log(`❌ NOT SUPPORTED: ${name}`);
      }
    }
  } catch (error) {
    console.error("Error connecting to API:", error.message);
  }
}

listSupportedModels();