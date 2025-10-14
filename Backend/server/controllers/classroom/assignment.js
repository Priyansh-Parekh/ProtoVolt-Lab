import asyncHandler from "express-async-handler";
import Classroom from "../../models/classrooms.js";
import Assignment from "../../models/assignments.js";

export const getAssignment = asyncHandler(async (req,res) => {
    const {classroomId, assignmentId} = req.params;
    const userID = req.user_id;

    const classroom = await Classroom.findById(classroomId)
                        .populate("assignments")
                        .populate("owner","_id")
                        .populate("professors","_id")
                        .populate("students","_id");

    if(!classroom) {
        res.status(404);
        throw new Error("Classroom not found");
    }

    const isMember =
        classroom.owner._id.equals(userID) ||
        classroom.professors.some(p => p._id.equals(userID)) ||
        classroom.students.some(s => s._id.equals(userID));

    if (!isMember) {
        res.status(403);
        throw new Error("Access denied — you are not part of this classroom");
    }
    
    const existsInClass = classroom.assignments.some(a => a._id.toString() === assignmentId);
    if(!existsInClass) {
        res.status(404);
        throw new Error("Assignment not found in this class");
    }

    const assignment = await Assignment.findById(assignmentId)
                        .populate("solutionCircuit")
                        .populate("subTabs");

    if(!assignment) {
        res.status(404);
        throw new Error("Assignment not found");
    }

    res.status(200).json(assignment);
});