// Import the C++ runner function from your workspace
import runSimulation from "../../../../workspace.js";
import Circuit from "../../models/circuits.js";

const solveWithCpp = async (req, res) => {
    
    // 1. Get the circuit data from the frontend's request
    const {circuit_data,project_id} = req.body;
    

    if (!circuit_data && !project_id) {
        return res.status(400).json({
            success: false,
            message: 'No circuit data provided'
        });
    }

    try {
        // 2. Call the workspace module
        console.log("⚙️ Calling C++ Engine...");
        // This will now *only* succeed if the C++ engine exits with 0
        const simulationResult = await runSimulation(circuit_data);
        console.log(simulationResult)

        const circuit = await Circuit.findById(project_id);

       if(circuit && !simulationResult.is_open){
            circuit.analysed = true;
       }
        // 3. Send the successful result back to the frontend
        console.log("✅ C++ Engine Finished.");
        res.status(200).json({
            success: true,
            message: simulationResult.message || "Simulation successful", // Use message from C++
            data: simulationResult // Send all data back
        });

    } catch (error) {
        // 4. Handle failures
        console.error("❌ Simulation Failed:", error.message || error);

        // *** NEW LOGIC ***
        // Check if this is a "logical error" (a JSON object) we rejected from workspace.js
        if (error && typeof error === 'object' && error.status === 'error') {
            // It's a "user error" (e.g., open circuit), not a server crash.
            // We send a 200 OK, but with success: false.
            return res.status(200).json({
                success: false,
                message: error.message || 'Simulation failed',
                data: error // Send the full error report
            });
        }

        // It's a "server error" (C++ crash, file write fail, etc.)
        res.status(500).json({
            success: false,
            message: error.message || 'Simulation failed due to an internal error',
            data: null
        });
    }
};

export default solveWithCpp;