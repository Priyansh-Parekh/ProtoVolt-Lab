import Assignment from "../../models/assignments.js";
import mongoose from "mongoose";
import Classroom from "../../models/classrooms.js";
import { uploadAssignmentFilesCloudinary } from "../../config/cloudinary.js";

const createAssignment = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { title, description, dueDate, classroomId, assignedApparatus, solutionCircuit } = req.body;

   

    if (!title || !description || !dueDate || !classroomId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    let parsedApparatus = [];
    if (assignedApparatus && typeof assignedApparatus === 'string') {
        try {
            parsedApparatus = JSON.parse(assignedApparatus);
        } catch (e) {
            return res.status(400).json({ success: false, message: "Invalid assignedApparatus format." });
        }
    }

    let parsedCircuits = [];
    if (solutionCircuit && typeof solutionCircuit === 'string') {
      try {
        const circuitIdArray = JSON.parse(solutionCircuit);
        
        // ====================== 🕵️ DEBUG LOGS START 🕵️ ======================
        console.log("Parsed circuit ID array BEFORE conversion:", circuitIdArray);
        // ======================= 🕵️ DEBUG LOGS END 🕵️ =======================

        if (Array.isArray(circuitIdArray)) {
          // Map and validate each ID. This will throw an error if any ID is invalid.
          parsedCircuits = circuitIdArray.map(id => new mongoose.Types.ObjectId(id));
        } else {
          throw new Error("solutionCircuit must be an array.");
        }
      } catch (err) {
        console.error("❌ Invalid format or ObjectId in solutionCircuit:", err.message);
        return res.status(400).json({ success: false, message: `Invalid format for solution circuits. Error: ${err.message}` });
      }
    }

    console.log("Attempting to convert classroomId:", classroomId);
    const class_Id = new mongoose.Types.ObjectId(classroomId);

    let url = null;
        if (req.file) {
            const result = await uploadAssignmentFilesCloudinary(req.file.path);
            url = result.secure_url || null;
            console.log(url);
        }
   

    const assignment = new Assignment({
      title,
      description,
      dueDate,
      assignedApparatus: parsedApparatus,
      solutionCircuit: parsedCircuits,
      professor: user._id,
      classroom: class_Id,
    //   uploadedFile: url;
   
    });

    await assignment.save();

    const classroom = await Classroom.findById(class_Id);
    classroom.assignments.push(assignment._id);
    await classroom.save();
    
    return res.status(201).json({
      success: true,
      message: "Assignment created successfully!",
    });

  } catch (err) {
    console.error("❌ Error creating assignment:", err); // This is where the error is caught
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default createAssignment;