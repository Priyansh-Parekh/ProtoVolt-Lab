// listModels.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'; // Import dotenv to load environment variables
dotenv.config(); // Load environment variables from .env file

const genAI = new GoogleGenerativeAI(process.env.Gemini_Key);

async function listAllModels() {
  try {
    const { models } = await genAI.listModels();
    console.log("Available Gemini Models and their supported methods:");
    for (const model of models) {
      console.log(`- Name: ${model.name}`);
      console.log(`  DisplayName: ${model.displayName}`);
      console.log(`  Supported Generation Methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('---');
    }
  } catch (error) {
    console.error("Error listing models:", error);
    console.error("Please ensure your API key is correct and has the necessary permissions.");
  }
}

listAllModels();