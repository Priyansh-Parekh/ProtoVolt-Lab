import Classroom from "../../models/classrooms.js";
import User from "../../models/users.js";
import Assignment from "../../models/assignments.js";
import mongoose from "mongoose";

const getAssignment = async (req, res) => {
  try {
    const { _id } = req.query;
    const user = req.user;

    if (!user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized access."
      });

    if (!_id)
      return res.status(400).json({
        success: false,
        message: "Assignment ID is required."
      });

    const assignmentId = new mongoose.Types.ObjectId(_id);

    const exists = await Assignment.findById(assignmentId)
      .populate({
        path: "professor",
        select: "name"
      })
      .populate("solutionCircuit")

      .populate({
        path: "subTabs",
        populate: { path: "circuit" } // get circuit inside each tab
      })
      
      .populate({
        path: "classroom",
        select: "students professors"
      });

    if (!exists)
      return res.status(404).json({
        success: false,
        message: "No such assignment exists."
      });

    let auth = false;

    if (user.role === "student" && exists.classroom?.students) {
      auth = exists.classroom.students.some(
        (s) => s.toString() === user._id.toString()
      );
    } else if (user.role === "professor" && exists.classroom?.professors) {
      auth = exists.classroom.professors.some(
        (p) => p.toString() === user._id.toString()
      );
    }

    if (!auth)
      return res.status(401).json({
        success: false,
        message: "Unauthorized access."
      });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched assignment.",
      assignment: exists,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

export default getAssignment;
