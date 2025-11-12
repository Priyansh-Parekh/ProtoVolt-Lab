import fs from "fs";
import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// --- FIX FOR __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END FIX ---

// This function is EXPORTED and returns a Promise
function runSimulation(circuit_data) {
    return new Promise((resolve, reject) => {
        const INPUT_FILE = `sim_input_${Date.now()}.json`; 
        const ENGINE_PATH = path.join(__dirname, "engine.exe");

        // A. Write Payload
        try {
            fs.writeFileSync(INPUT_FILE, JSON.stringify(circuit_data, null, 2), "utf8");
            console.log(`📦 Payload written to ${INPUT_FILE}`);
        } catch (err) {
            console.error("❌ Failed to write payload:", err);
            return reject(new Error("Failed to write payload")); 
        }

        // B. Execute C++ Engine
        console.log("⚙️ Running C++ Engine...");
        execFile(ENGINE_PATH, [INPUT_FILE], (error, stdout, stderr) => {
            // D. Cleanup (do this first)
            try {
                if (fs.existsSync(INPUT_FILE)) {
                    fs.unlinkSync(INPUT_FILE);
                }
            } catch (cleanupErr) {
                console.error("⚠️ Cleanup failed:", cleanupErr);
            }
            
            // Handle C++ stderr
            if (stderr) console.error(`⚠️ [STDERR]: ${stderr}`);

            // *** NEW LOGIC ***
            // C. Handle C++ Exit Code and Output
            
            // Case 1: Non-zero exit code (error)
            if (error) {
                console.warn(`C++ Engine exited with code ${error.code}`);
                // Try to parse stdout even on error, as our C++ engine
                // now sends logical errors (like "open circuit") this way.
                try {
                    const errorResult = JSON.parse(stdout);
                    // We successfully parsed the error report
                    console.error("❌ C++ Engine reported a logical error:", errorResult.message);
                    // Reject with the *parsed object*
                    return reject(errorResult); 
                } catch (e) {
                    // C++ engine crashed badly or output was unreadable
                    console.error(`❌ Execution Error: ${error.message}`);
                    return reject(new Error(error.message)); // Reject with the exec error
                }
            }

            // Case 2: Zero exit code (success)
            try {
                const result = JSON.parse(stdout);
                console.log("✅ C++ Engine Finished Successfully.");
                // Resolve the promise with the result object
                resolve(result); 
            } catch (e) {
                console.error("❌ Could not parse engine output:", stdout);
                reject(new Error("Could not parse engine output")); // Reject on parse error
            }
        });
    });
}

// Exporting the function as default
export default runSimulation;