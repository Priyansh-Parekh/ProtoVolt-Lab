// Import the Google AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";
import runSimulation from "../../../../workspace.js";

const genAI = new GoogleGenerativeAI(process.env.Gemini_Key);

const solve = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const {circuit_data} = req.body;


    const prompt = `
    You are a highly advanced expert in electrical and electronic circuit analysis. Your capabilities include DC analysis, AC steady-state analysis, basic transistor biasing, and digital logic evaluation.
    
    Given a JSON object that describes an electrical circuit, your task is to perform a complete analysis. The circuit can contain a mix of the following components: ['resistor', 'capacitor', 'inductor', 'dc-source', 'ac-source', 'ground', 'transistor-npn', 'and-gate', 'or-gate', 'not-gate', 'xor-gate', 'nand-gate', 'nor-gate', 'ammeter', 'voltmeter'].
      ${JSON.stringify(circuit_data, null, 2)}


    Your detailed instructions are:
    
    1.  **Analyze the Input JSON:**
        * Parse the provided circuit description.
        * Identify all components, their properties, and their connections (nodes).
        * Determine the required analysis type based on the components present (e.g., 'DC', 'AC Steady-State', 'Digital Logic'). If both AC and DC sources exist, perform a DC analysis for biasing and an AC analysis for the signal, assuming superposition is applicable.
    
    2.  **Validate the Circuit:**
        * Check for logical errors such as short-circuited voltage sources, floating (unconnected) components, or invalid node connections.
        * Ensure all necessary properties for components are provided (e.g., an AC source must have a frequency).
        * If the circuit is invalid or unsolvable, you must return a JSON object with "solved": false and a brief explanation in an "error_message" field.
    
    3.  **Perform Circuit Calculations:**
        * **General Assumptions:**
            * Model the internal resistance of a DC source as a separate, explicit resistor in series with an ideal source.
            * Assume wires are ideal (0Ω resistance).
            * Assume meters are ideal unless an internal resistance is specified (Ammeter: 0Ω, Voltmeter: ∞Ω).
        * **For DC Analysis:**
            * Calculate all node voltages relative to the ground node (node '0' or a component with type 'ground').
            * Calculate the current flowing through, the voltage drop across, and the power for each component.
        * **For AC Steady-State Analysis:**
            * Use the first AC source's frequency for the entire circuit analysis.
            * Calculate the complex impedance ($Z$) for all capacitors ($Z_C = 1 / (jωC)$) and inductors ($Z_L = jωL$).
            * Solve for the phasor values (magnitude and phase) of all node voltages and branch currents. Represent phasors as strings, e.g., "5.0∠36.87° V".
        * **For NPN Transistors (DC Biasing):**
            * Determine the DC operating point (Q-point): Base Current ($I_B$), Collector Current ($I_C$), and Collector-Emitter Voltage ($V_{CE}$).
            * Assume $V_{BE(on)} = 0.7V$ and a current gain ($\beta$ or hFE) of 100 if not specified in properties.
            * Determine and state the operating region: 'Cutoff', 'Active', or 'Saturation'.
        * **For Digital Logic Gates:**
            * Determine the output logic state ('0' or '1') based on the input logic states.
            * If inputs are connected to analog nodes, use a voltage threshold (e.g., V > 2.5V is '1', V <= 2.5V is '0' for a 5V system) to determine the logic level.
    
    4.  **Generate the Output:**
        * Construct a JSON object with the complete analysis results.
        * Fill in any missing values for voltage, current, power, impedance, etc., in the properties of each component in the final output.
        * The "components" array in the output should be a deep copy of the input array, augmented with the calculated values.
  
    
    **Expected Output Format:**
    {
      "solved": true,
      "analysis_type": "DC" | "AC Steady-State" | "Digital Logic" | "Mixed",
      "error_message": null, // or a string description if solved is false
      "summary": {
        "total_power_dissipated": "X W",
        "equivalent_impedance": "Z Ω" // As seen by the primary source
      },
     
      "components": [
        // Array of component objects from input, with added calculated properties.
        // Example for a resistor:
        {
          "id": "c1",
          "type": "resistor",
          "label": "R1",
          "properties": {
            "resistance": "1kΩ",
            "voltage_drop": "5 V",
            "current": "5 mA",
            "power": "25 mW"
          }
        }
      ]
    }
    
    ⚠️ Important: Your final output must be **ONLY the raw JSON object**. Do not include any explanatory text, markdown formatting, or code blocks.
    `;

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

    
    // console.log(parsed)

    res.status(200).json({
      success: true,
      message:"gemini responded",
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

export default solve;
