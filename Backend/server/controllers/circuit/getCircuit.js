import Circuit from "../../models/circuits.js";
import User from "../../models/users.js";

const getCircuit = async (req, res) => {
  try {
    const { id ,view} = req.query;
    const user = req.user;

    // 1️⃣ Fetch and populate deeply inside circuitdata
    const circuit = await Circuit.findById(id)
      .populate({
        path: "circuitdata.components",
        populate: {
          path: "terminals.node",
          model: "Node",
        },
      })
      .populate("circuitdata.nodes");

    if (!circuit)
      return res.status(404).json({
        success: false,
        message: "Circuit not found"
      });


    // ✅ Fix: Proper ObjectId comparison
   if(view!=="true"){
    if (String(circuit.owner) !== String(user._id))
      return res.status(400).json({
        success: false,
        message: "Unauthorized access"
      });
   }

    // 2️⃣ Extract and rebuild frontend data
    const nodes = circuit.circuitdata.nodes.map(node => ({
      id: node.id,
      position: node.position,
    }));

    const components = circuit.circuitdata.components.map(comp => ({
      id: comp.id,
      type: comp.type,
      label: comp.label,
      position: comp.position,
      properties: comp.properties,
      terminals: comp.terminals.map(t => ({
        id: t.id,
        nodeId: t.node ? t.node.id : null, // restore frontend node id
      })),
    }));

    // 3️⃣ Final formatted circuit for frontend
    const circuitData = {
      _id: circuit._id,
      name: circuit.name,
      analysed: circuit.analysed,
      nodes,
      components,
    };

    return res.status(200).json({
      success: true,
      message: "Circuit fetched successfully",
      circuit: circuitData,
    });
  } catch (err) {
    console.error("Error fetching circuit:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export default getCircuit;
