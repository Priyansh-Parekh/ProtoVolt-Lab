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
        const simulationResult = await runSimulation(circuit_data);
        console.log(simulationResult)

        const circuit = await Circuit.findById(project_id);

       if(circuit && !simulationResult.is_open){
            circuit.analysed = true;
       }
        console.log("✅ C++ Engine Finished.");
        res.status(200).json({
            success: true,
            message: simulationResult.message || "Simulation successful", 
            data: simulationResult 
        });

    } catch (error) {
        console.error("❌ Simulation Failed:", error.message || error);
 
        if (error && typeof error === 'object' && error.status === 'error') {
            return res.status(200).json({
                success: false,
                message: error.message || 'Simulation failed',
                data: error 
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Simulation failed due to an internal error',
            data: null
        });
    }
};

export default solveWithCpp;