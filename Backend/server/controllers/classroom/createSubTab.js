import Assignment from "../../models/assignments.js";
import SubTab from "../../models/subTab.js";
import Circuit from "../../models/circuits.js";
import mongoose from "mongoose";
import StudAss from "../../models/studAss.js";

const createSubTab = async (req, res) => {
  try {
    const { ass_Id, name } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ success: false, message: "Unauthorized access." });

    if (!ass_Id || !name) {
      return res.status(400).json({ success: false, message: "assignmentId and name are required." });
    }

    const as_id = new mongoose.Types.ObjectId(ass_Id);

    const assignment = await Assignment.findById(as_id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found." });
    }

    const circuit = await Circuit.create({name,owner:user._id});
    await circuit.save();

    const newTab = await SubTab.create({ name , circuit:circuit._id});
    await newTab.save();

    const studentAssignment = await StudAss.find({owner:user._id,assignment:as_id});
    studentAssignment[0].subTabs.push(newTab._id);
    await studentAssignment[0].save();

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
