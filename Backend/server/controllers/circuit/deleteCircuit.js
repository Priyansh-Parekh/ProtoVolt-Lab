import mongoose from "mongoose";
import Circuit from "../../models/circuits.js";
import Node from "../../models/nodes.js";
import Component from "../../models/components.js";
import User from "../../models/users.js";

const deleteCircuit = async (req, res) => {
  try {
    const { id } = req.body;
    const user = req.user;

    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized Access" });
    if (!id)
      return res.status(400).json({ success: false, message: "Circuit ID required" });

    const circuitId = new mongoose.Types.ObjectId(id);

    const circuit = await Circuit.findById(circuitId);
    if (!circuit)
      return res.status(404).json({ success: false, message: "Circuit not found" });

    const nodeIds = circuit.circuitdata?.nodes || [];
    const componentIds = circuit.circuitdata?.components || [];

    if (nodeIds.length > 0) await Node.deleteMany({ _id: { $in: nodeIds } });
    if (componentIds.length > 0) await Component.deleteMany({ _id: { $in: componentIds } });

    await Circuit.deleteOne({ _id: circuitId });

    await User.findByIdAndUpdate(user._id, { $pull: { circuits: circuitId } });

    return res.status(200).json({ success: true, message: "Circuit and related data deleted" });
  } catch (err) {
    console.error("Delete circuit error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default deleteCircuit;
