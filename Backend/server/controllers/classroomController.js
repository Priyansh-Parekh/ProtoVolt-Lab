import asyncHandler from "express-async-handler";
import Classroom from "../models/classrooms.js";
import Users from "../models/users.js";
import Assignment from "../models/assignments.js";
import Announcement from "../models/announcements.js";

export const createClassroom = asyncHandler(async (req, res) => {
    const { name, owner, course, description, joinCode, role } = req.body;

    if (!name || !owner || !course || !joinCode) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    if(!["professor"].includes(role.toLowerCase())) {
        res.status(400);
        throw new Error("Current role invalid for creating classes");
    }

    const classroom = new Classroom({
        name,
        owner,
        course,
        description,
        joinCode,
        assignments: [],
        announcements: [],
        students: [],
        professors: [],
    });

    const savedClassroom = await classroom.save();
    res.status(201).json(savedClassroom);
});

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

export const getAnnouncement = asyncHandler( async (req, res) => {
    const {classroomId, announcementId} = req.body;
    const userID = req.user_id;

    const classroom = await Classroom.findById(classroomId)
                        .populate("announcements")
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

    const annExistsInClass = classroom.announcements.some(a => a._id.toString() === announcementId);

    if(!annExistsInClass) {
        res.status(404);
        throw new Error("Announcement not found in this class");
    }

    const announcement = await Announcement.findById(announcementId)
                            .populate("professor","name email");

    if(!announcement) {
        res.status(404);
        throw new Error("Announcement not found, or has been deleted");
    }

    res.status(200).json(announcement);
});