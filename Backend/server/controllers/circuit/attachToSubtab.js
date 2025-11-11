import SubTab from "../../models/subTab.js";
import mongoose from "mongoose";

const attachToSubtab = async (req, res) => {
  try {
    const { subtabId, circuitId } = req.body;

    if (!subtabId || !circuitId)
      return res.status(400).json({ success: false, message: "Missing fields" });

    await SubTab.findByIdAndUpdate(subtabId, { circuit: circuitId });

    return res.status(200).json({ success: true, message: "Circuit linked to subtab." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default attachToSubtab;