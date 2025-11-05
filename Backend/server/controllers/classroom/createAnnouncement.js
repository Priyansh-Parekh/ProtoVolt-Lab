import mongoose from "mongoose";
import Classroom from "../../models/classrooms.js";
import Announcement from "../../models/announcements.js";
import asyncHandler from "express-async-handler";

const createAnnouncement = asyncHandler(async (req, res) => {
    const { classroomId } = req.params;
    const { title, content, fileUrl } = req.body;
    const userId = req.user._id;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    if (!mongoose.isValidObjectId(classroomId)) {
        return res.status(400).json({ message: "Invalid classroom ID" });
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
        return res.status(404).json({ message: "Classroom not found" });
    }

    const isProfessor = classroom.professors.includes(userId.toString());
    if (!isProfessor) {
        return res.status(403).json({ message: "Only professors can create announcements" });
    }

    const announcement = await Announcement.create({
        title,
        content,
        professor: userId,
        file: fileUrl || null
    });

    classroom.announcements.push(announcement._id);
    await classroom.save();

    res.status(201).json({
        message: "Announcement created successfully",
        announcement
    });
});

export default createAnnouncement;