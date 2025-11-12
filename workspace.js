import fs from "fs";
import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// --- FIX FOR __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END FIX ---

// 3. Execution Logic
// This function is now EXPORTED and returns a Promise
// It accepts circuitData as an argument
export function runSimulation(circuitData) {
    // We wrap the execFile in a Promise so the server can 'await' the result
    return new Promise((resolve, reject) => {
        // Use a unique filename for each simulation to avoid conflicts
        const INPUT_FILE = `sim_input_${Date.now()}.json`; 
        const ENGINE_PATH = path.join(__dirname, "engine.exe");

        // A. Write Payload
        try {
            fs.writeFileSync(INPUT_FILE, JSON.stringify(circuitData, null, 2), "utf8");
            console.log(`📦 Payload written to ${INPUT_FILE}`);
        } catch (err) {
            console.error("❌ Failed to write payload:", err);
            return reject(new Error("Failed to write payload")); // Reject the promise on error
        }

        // B. Execute C++ Engine
        console.log("⚙️ Running C++ Engine...");
        execFile(ENGINE_PATH, [INPUT_FILE], (error, stdout, stderr) => {
            // D. Cleanup (do this first, regardless of error)
            try {
                if (fs.existsSync(INPUT_FILE)) {
                    fs.unlinkSync(INPUT_FILE);
                }
            } catch (cleanupErr) {
                console.error("⚠️ Cleanup failed:", cleanupErr);
                // Don't reject, we might still have a result
            }
            
            // Handle errors from the C++ engine
            if (stderr) console.error(`⚠️ [STDERR]: ${stderr}`);
            if (error) {
                console.error(`❌ Execution Error: ${error.message}`);
                return reject(new Error(error.message)); // Reject the promise
            }

            // C. Parse Results
            try {
                const result = JSON.parse(stdout);
                console.log("✅ C++ Engine Finished.");
                // This is the fix: We resolve the promise with the result object
                resolve(result); 
            } catch (e) {
                console.error("❌ Could not parse engine output:", stdout);
                reject(new Error("Could not parse engine output")); // Reject on parse error
            }
        });
    });
}

// Exporting the function as default (matches your original code)
export default runSimulation;