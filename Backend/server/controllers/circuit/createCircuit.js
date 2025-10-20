import Component from "../../models/components.js";
import Circuit from "../../models/circuits.js";
import Node from "../../models/nodes.js";

const createCircuit = async (req, res) => {
  try {
    const { circuit } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ success: false, message: "Unauthorized Access" });
    if (!circuit) return res.status(400).json({ success: false, message: "Circuit not provided" });

    // 🧩 Step 1: Create all nodes
    const createdNodes = await Promise.all(
      circuit.nodes.map(node =>
        Node.create({
          id: node.id,
          position: node.position,
        })
      )
    );

    // Map frontend node.id → MongoDB _id
    const nodeIdMap = {};
    createdNodes.forEach(node => {
      nodeIdMap[node.id] = node._id;
    });

    // 🧩 Step 2: Create components with correct node references
    const createdComps = await Promise.all(
      circuit.components.map(comp => {
        const terminals = comp.terminals.map(t => ({
          id: t.id,
          node: nodeIdMap[t.nodeId] || null,
        }));

        return Component.create({
          id: comp.id,
          type: comp.type,
          label: comp.label,
          position: comp.position,
          properties: comp.properties,
          terminals,
        });
      })
    );

    // 🧩 Step 3: Create circuit properly nested under circuitdata
    const newCircuit = await Circuit.create({
      name: circuit.name || "Untitled Circuit",
      owner: user._id,
      circuitdata: {
        components: createdComps.map(c => c._id),
        nodes: createdNodes.map(n => n._id),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Circuit created successfully",
      circuit: newCircuit,
    });
  } catch (err) {
    console.error("Error creating circuit:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

export default createCircuit;
