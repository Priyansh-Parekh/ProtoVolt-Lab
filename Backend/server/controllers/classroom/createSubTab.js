import Assignment from "../../models/assignments.js";
import SubTab from "../../models/subTab.js";
import mongoose from "mongoose";

const createSubTab = async (req, res) => {
  try {
    const { assignmentId, name } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ success: false, message: "Unauthorized access." });

    if (!assignmentId || !name) {
      return res.status(400).json({ success: false, message: "assignmentId and name are required." });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found." });
    }

    // ✅ Create SubTab (no circuit yet)
    const newTab = await SubTab.create({ name });

    // ✅ Push subtab into Assignment
    assignment.subTabs.push(new mongoose.Types.ObjectId(newTab._id));
    await assignment.save();

    return res.status(201).json({
      success: true,
      message: "SubTab created successfully.",
      subTab: newTab
    });

  } catch (error) {
    console.log("❌ Error creating SubTab:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default createSubTab;
