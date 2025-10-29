// Import the Google AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.Gemini_Key);

const test = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const circuit_data = {
      "nodes": [
        {
          "id": "node-dwxvy92ad",
          "position": { "x": 354.1999969482422, "y": 328 }
        },
        {
          "id": "node-d8hq1k1re",
          "position": { "x": 434.1999969482422, "y": 328 }
        }
      ],
      "components": [
        {
          "id": "comp-j8396tsik",
          "type": "resistor",
          "label": "R1",
          "position": { "x": 399.1999969482422, "y": 195 },
          "properties": {
            "resistance": { "value": "10", "unit": "Ω" },
            "voltage": { "value": "", "unit": "" },
            "current": { "value": "", "unit": "" }
          },
          "terminals": [
            { "id": "t1", "nodeId": "node-dwxvy92ad" },
            { "id": "t2", "nodeId": "node-d8hq1k1re" }
          ]
        },
        {
          "id": "comp-el6gvuhpt",
          "type": "dc-source",
          "label": "D1",
          "position": { "x": 394.1999969482422, "y": 328 },
          "rotation": 0,
          "properties": {
            "voltage": { "value": "15", "unit": "V" },
            "internalResistance": { "value": "5", "unit": "Ω" }
          },
          "terminals": [
            { "id": "positive", "nodeId": "node-d8hq1k1re" },
            { "id": "negative", "nodeId": "node-dwxvy92ad" }
          ]
        }
      ]
    };

    const prompt = `
You are an expert in electrical circuit analysis.

Given this JSON object describing an electrical circuit:
${JSON.stringify(circuit_data, null, 2)}

Analyze it using Ohm's law and Kirchhoff's laws.

Your task:
1. Fill in missing values (voltage, current, resistance, etc.).
2. Compute total resistance, total current, and voltage.
3. Return ONLY the solved data in **valid JSON format**, with no markdown or explanation text.

Expected output format:
{
  "solved": true,
  "summary": {
    "total_voltage": "X V",
    "total_current": "Y A",
    "total_resistance": "Z Ω"
  },
  "components": [
    {
      "id": "same as input",
      "type": "resistor or dc-source",
      "label": "R1",
      "properties": {
        "resistance": { "value": "R", "unit": "Ω" },
        "voltage": { "value": "V", "unit": "V" },
        "current": { "value": "I", "unit": "A" }
      }
    }
  ]
}

⚠️ Important: Return **ONLY raw JSON**, without any code blocks, markdown, or text.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean possible markdown fences (```json ... ```)
    text = text.replace(/```json|```/g, '').trim();

    // Try to parse it
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.warn("Warning: Gemini returned non-JSON response, returning raw text");
      parsed = text;
    }

    res.status(200).json({
      success: true,
      data: parsed,
    });

  } catch (error) {
    console.error("Error in Gemini Controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export default test;
