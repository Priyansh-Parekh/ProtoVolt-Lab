import asyncHandler from "express-async-handler";
import Classroom from "../models/classrooms.js";
import Users from "../models/users.js";

export const createClassroom = asyncHandler(async (req, res) => {
    const { name, owner, course, description, joinCode, role } = req.body;

    if (!name || !owner || !course || !joinCode) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    if(!["professor","owner"].includes(role.toLowerCase())) {
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