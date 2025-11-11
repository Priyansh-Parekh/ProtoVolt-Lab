// Import necessary modules using ESM syntax
import 'dotenv/config'; // Loads .env file contents into process.env
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the client with your API key from process.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * An async function to fetch and log available generative models.
 */
async function listAvailableModels() {
  console.log("Fetching list of models your API key can access...");
  try {
    const models = await genAI.listModels();
    let foundModels = false;

    for await (const m of models) {
      // Filter for models that support the 'generateContent' method
      if (m.supportedGenerationMethods.includes('generateContent')) {
        console.log(`✅ Model Name: ${m.name}`); // e.g., models/gemini-1.0-pro
        console.log(`   - Display Name: ${m.displayName}`);
        console.log(`   - Description: ${m.description}\n`);
        foundModels = true;
      }
    }

    if (!foundModels) {
      console.log("❌ No models supporting 'generateContent' were found for this API key.");
    }

  } catch (error) {
    console.error("Error listing models:", error);
  }
}

// Execute the function
listAvailableModels();